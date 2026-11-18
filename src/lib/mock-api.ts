import type { CandidateProfile } from "@/types";
import { MOCK_PROFILE } from "@/data/mock-profile";

/**
 * The prototype has no backend. This module is the only persistence layer and
 * it writes to localStorage behind a namespaced key, so the demo can be reset
 * by clearing site data. Nothing here performs a network request.
 */
const PREFIX = "onias.demo.v1.";
const PROFILE_KEY = `${PREFIX}profile`;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** True once this browser holds a profile the visitor created or edited. */
export function hasStoredProfile() {
  if (!canUseStorage()) return false;
  try {
    return Boolean(window.localStorage.getItem(PROFILE_KEY));
  } catch {
    return false;
  }
}

export function getProfile(): CandidateProfile {
  if (!canUseStorage()) return MOCK_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return MOCK_PROFILE;
    const parsed = JSON.parse(raw) as Partial<CandidateProfile> | null;
    if (!parsed || typeof parsed !== "object") return MOCK_PROFILE;

    // Arrays are respected even when empty: a profile created from scratch must
    // not inherit the demo candidate's experience, skills or blocked domains.
    return {
      ...MOCK_PROFILE,
      ...parsed,
      salary: { ...MOCK_PROFILE.salary, ...parsed.salary },
      skills: Array.isArray(parsed.skills) ? parsed.skills : MOCK_PROFILE.skills,
      skillGroups: Array.isArray(parsed.skillGroups) ? parsed.skillGroups : MOCK_PROFILE.skillGroups,
      languages: Array.isArray(parsed.languages) ? parsed.languages : MOCK_PROFILE.languages,
      experiences: Array.isArray(parsed.experiences) ? parsed.experiences : MOCK_PROFILE.experiences,
      education: Array.isArray(parsed.education) ? parsed.education : MOCK_PROFILE.education,
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : MOCK_PROFILE.certifications,
      regions: Array.isArray(parsed.regions) ? parsed.regions : MOCK_PROFILE.regions,
      notAllowedCompanies: Array.isArray(parsed.notAllowedCompanies)
        ? parsed.notAllowedCompanies
        : MOCK_PROFILE.notAllowedCompanies,
    };
  } catch {
    return MOCK_PROFILE;
  }
}

export async function saveProfile(profile: CandidateProfile): Promise<CandidateProfile> {
  if (canUseStorage()) {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("onias:profile", { detail: profile }));
  }
  return profile;
}

export function resetProfile(): CandidateProfile {
  if (!canUseStorage()) return MOCK_PROFILE;
  window.localStorage.removeItem(PROFILE_KEY);
  window.dispatchEvent(new CustomEvent("onias:profile", { detail: MOCK_PROFILE }));
  return MOCK_PROFILE;
}

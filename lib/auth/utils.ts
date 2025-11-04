/**
 * Authentication utility functions
 * Checks localStorage and sessionStorage for authentication tokens
 */

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check both localStorage and sessionStorage
  const localAuthed = localStorage.getItem("rsc_authed");
  const sessionAuthed = sessionStorage.getItem("rsc_authed");
  
  // User is authenticated if either storage has the auth flag
  return localAuthed === "1" || sessionAuthed === "1";
}

export function getAuthData(): { userId: string | null; email: string | null } {
  if (typeof window === "undefined") {
    return { userId: null, email: null };
  }

  // Check localStorage first, then sessionStorage
  const userId = localStorage.getItem("rsc_user_id") || sessionStorage.getItem("rsc_user_id");
  const email = localStorage.getItem("rsc_email") || sessionStorage.getItem("rsc_email");

  return { userId, email };
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  // Clear from both storages
  localStorage.removeItem("rsc_user_id");
  localStorage.removeItem("rsc_email");
  localStorage.removeItem("rsc_authed");
  localStorage.removeItem("rsc_token");
  
  sessionStorage.removeItem("rsc_user_id");
  sessionStorage.removeItem("rsc_email");
  sessionStorage.removeItem("rsc_authed");
  sessionStorage.removeItem("rsc_token");
}

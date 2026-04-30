import { redirect } from "next/navigation";

/**
 * Onboarding page — in v1, every user gets a personal workspace.
 * We use the user's ID as the "org slug" for URL compatibility
 * without implementing full multi-tenant orgs.
 *
 * This server component fetches the session and redirects to the
 * user's personal workspace.
 */
export default async function OnboardingPage() {
  // In v1 there are no real orgs — redirect to a fixed personal slug.
  // The actual user context is resolved via session cookie in the API.
  redirect("/app/inbox");
}

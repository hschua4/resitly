import { redirect } from "next/navigation";

// Root page — redirect to sign-in. Authenticated users will be handled by middleware.
export default function RootPage() {
  redirect("/sign-in");
}

import { redirect } from "next/navigation";

export default function OrganizationsRedirect() {
  redirect("/dashboard/settings?tab=organizations");
}

import { redirect } from "next/navigation";

export default function DuplicateEvidenceRedirect() {
  redirect("/dashboard/evidence?tab=duplicates");
}

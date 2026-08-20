import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { termsOfUse } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use — FARMILY",
  description: "The terms covering your use of farmilytechnologies.com.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow={termsOfUse.eyebrow}
      title={termsOfUse.title}
      intro={termsOfUse.intro}
      sections={termsOfUse.sections}
    />
  );
}

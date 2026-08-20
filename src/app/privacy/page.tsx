import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacyPolicy } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — FARMILY",
  description: "What information FARMILY collects through this website, and why.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow={privacyPolicy.eyebrow}
      title={privacyPolicy.title}
      intro={privacyPolicy.intro}
      sections={privacyPolicy.sections}
    />
  );
}

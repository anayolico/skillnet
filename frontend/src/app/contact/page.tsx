import type { Metadata } from 'next';
import LegalPageLayout from '../../../components/LegalPageLayout';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Support | SkillNet',
  description:
    'Get in touch with the SkillNet team for account help, swap mediation, privacy requests, or membership billing.',
};

export default function ContactPage() {
  return (
    <LegalPageLayout
      category="Support"
      title="Contact SkillNet"
      summary="Reach our team directly for account questions, swap mediation, billing support, or privacy inquiries."
      lastUpdated="November 2026"
    >
      <ContactForm />
    </LegalPageLayout>
  );
}

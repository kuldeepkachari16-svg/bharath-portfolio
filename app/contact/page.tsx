import { SocialLinks } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <main id="main" className="contact-page">
      <div className="contact-heading">
        <h1>Contact</h1>
      </div>
      <div className="contact-layout">
        <div className="contact-details">
          <a href="mailto:bharath_v@nid.edu">bharath_v@nid.edu</a>
          <SocialLinks />
        </div>
        <ContactForm
          deliveryEnabled={Boolean(
            process.env.GITHUB_PAGES !== "true" &&
            process.env.RESEND_API_KEY &&
            process.env.CONTACT_FROM,
          )}
        />
      </div>
    </main>
  );
}

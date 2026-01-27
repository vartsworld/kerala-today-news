import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, Mail, MessageCircle } from "lucide-react";

const ContactBanner = () => {
  return (
    <section className="w-full border-y bg-primary">
      <div className="container mx-auto py-3 flex flex-col md:flex-row items-center justify-center gap-3 animate-fade-in">
        <p className="text-sm md:text-base font-medium text-primary-foreground">വാർത്തകൾക്കും, പരസ്യങ്ങൾക്കും വിളിക്കുക</p>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {CONTACT.phoneTel && (
            <a className="story-link" href={`tel:${CONTACT.phoneTel}`} aria-label="Call Kerala Today News">
              <span className="inline-flex items-center gap-1 text-primary-foreground">
                <Phone className="size-4" /> {CONTACT.phoneDisplay}
              </span>
            </a>
          )}
          {CONTACT.email && (
            <a className="story-link" href={`mailto:${CONTACT.email}`} aria-label="Email Kerala Today News">
              <span className="inline-flex items-center gap-1 text-primary-foreground">
                <Mail className="size-4" /> {CONTACT.email}
              </span>
            </a>
          )}
          {CONTACT.whatsapp && (
            <a className="story-link" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Kerala Today News">
              <span className="inline-flex items-center gap-1 text-primary-foreground">
                <MessageCircle className="size-4" /> WhatsApp
              </span>
            </a>
          )}
        </nav>
      </div>
    </section>
  );
};

export default ContactBanner;

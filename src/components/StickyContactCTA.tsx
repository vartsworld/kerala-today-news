import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, MessageCircle } from "lucide-react";

const StickyContactCTA = () => {
  if (!CONTACT.phoneTel && !CONTACT.whatsapp) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 animate-fade-in">
      {CONTACT.whatsapp && (
        <a
          href={whatsappLink("Hi, I have news/ads to share")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="WhatsApp Achayans Media"
        >
          <MessageCircle className="size-6" />
        </a>
      )}
      {CONTACT.phoneTel && (
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-foreground border shadow hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Call Achayans Media"
        >
          <Phone className="size-6" />
        </a>
      )}
    </div>
  );
};

export default StickyContactCTA;

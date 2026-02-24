import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, MessageCircle } from "lucide-react";

const StickyContactCTA = () => {
  if (!CONTACT.phoneTel && !CONTACT.whatsapp) return null;
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col gap-3 animate-fade-in safe-area-bottom">
      {CONTACT.whatsapp && (
        <a
          href={whatsappLink("Hi, I have news/ads to share")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="WhatsApp Kerala Today News"
        >
          <MessageCircle className="size-5 sm:size-6" />
        </a>
      )}
      {CONTACT.phoneTel && (
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-secondary text-foreground border shadow hover-scale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Call Kerala Today News"
        >
          <Phone className="size-5 sm:size-6" />
        </a>
      )}
    </div>
  );
};

export default StickyContactCTA;

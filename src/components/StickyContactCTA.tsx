import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, MessageCircle } from "lucide-react";

const StickyContactCTA = () => {
  if (!CONTACT.phoneTel && !CONTACT.whatsapp) return null;
  return (
    <div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-6 z-30 flex flex-col items-center gap-3">
      {CONTACT.whatsapp && (
        <a
          href={whatsappLink("Hi, I have news/ads to share")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl ring-2 ring-primary/30 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
          aria-label="WhatsApp Kerala Today News"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
      {CONTACT.phoneTel && (
        <a
          href={`tel:${CONTACT.phoneTel}`}
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background text-foreground border-2 border-border shadow-xl ring-2 ring-border/30 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
          aria-label="Call Kerala Today News"
        >
          <Phone className="h-6 w-6" />
        </a>
      )}
    </div>
  );
};

export default StickyContactCTA;

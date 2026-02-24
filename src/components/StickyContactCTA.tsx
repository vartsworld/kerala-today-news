import { useState, useEffect } from "react";
import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, MessageCircle, Facebook } from "lucide-react";

const StickyContactCTA = ({ isArticle = false, facebookUrl }: { isArticle?: boolean; facebookUrl?: string }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!CONTACT.phoneTel && !CONTACT.whatsapp && (!isArticle || !facebookUrl)) return null;
  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex flex-col items-center gap-3 safe-area-bottom">
      {isArticle && facebookUrl && (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#1877F2] text-white shadow-xl ring-2 ring-[#1877F2]/30 transition-all duration-500 transform ${scrolled ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
            } hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring`}
          aria-label="Open on Facebook"
        >
          <Facebook className="h-6 w-6" />
        </a>
      )}
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

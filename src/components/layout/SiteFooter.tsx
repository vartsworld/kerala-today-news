import { CONTACT, whatsappLink } from "@/config/contact";
import { Phone, Mail, MessageCircle, ExternalLink, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="mt-12 sm:mt-16 border-t bg-secondary/30 safe-area-bottom">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-primary">Kerala Today News</h2>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1 font-medium">
                Your Daily News Source
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
              Independent local news and in-depth editorials committed to delivering accurate,
              timely information to our community.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Get in Touch</h3>
              <div className="flex flex-col gap-2">
                {CONTACT.phoneTel && (
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {CONTACT.phoneDisplay}
                  </a>
                )}
                {CONTACT.email && (
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {CONTACT.email}
                  </a>
                )}
                {CONTACT.whatsapp && (
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    WhatsApp
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )}
                {CONTACT.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1 max-w-xs">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
                    <span>{CONTACT.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Navigate</h3>
            <nav className="space-y-3">
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/">Home</Link>
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/editorial">Editorial</Link>
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/about">About Us</Link>
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/contact">Contact Us</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
            <nav className="space-y-3">
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/terms">Terms & Conditions</Link>
              <Link className="block text-sm text-muted-foreground hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Kerala Today News. All rights reserved.
              </p>
            </div>

            {/* Developer Credit */}
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground mb-1">
                Developed & Designed by
              </p>
              <a
                href="https://vawtech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline hover:opacity-80 transition-all flex items-center justify-center md:justify-end gap-1"
              >
                VAW Technologies
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;

import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const SiteHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed header wrapper — always full-width so sticky context is preserved */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out">
        <div
          className={`transition-all duration-500 ease-in-out ${scrolled
            ? "w-[94%] sm:w-[90%] bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[32px] sm:rounded-b-[48px] border-x border-b"
            : "w-full bg-background border-b"
            }`}
        >
          <div className="px-4 flex h-16 sm:h-20 items-center justify-between relative">
            {/* Logo */}
            <Link to="/" className="z-10 shrink-0" aria-label="Kerala Today News home">
              <img
                src="/lovable-uploads/kerala-today-logo.png"
                alt="Kerala Today News logo"
                className="h-10 w-auto sm:h-14 rounded"
              />
            </Link>

            {/* Centered Title */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center pointer-events-none sm:pointer-events-auto"
            >
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-none">
                Kerala Today News
              </span>
              <span className="hidden sm:block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5 font-medium leading-none whitespace-nowrap">
                Your Daily News Source
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "font-semibold text-primary" : "opacity-70 hover:opacity-100 transition-opacity"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/editorial"
                className={({ isActive }) =>
                  `text-sm ${isActive ? "font-semibold text-primary" : "opacity-70 hover:opacity-100 transition-opacity"}`
                }
              >
                Editorial
              </NavLink>
              <Button asChild variant="hero" size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
                <a href="#latest" aria-label="Jump to latest">Latest</a>
              </Button>
              <ThemeToggle />
            </nav>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't hide under the fixed header */}
      <div className="h-16 sm:h-20" aria-hidden="true" />

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer */}
      <nav
        className={`fixed top-0 right-0 h-full w-[280px] bg-background border-l z-50 shadow-2xl transition-transform duration-300 ease-in-out sm:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-4">
          <div className="flex flex-col gap-1 overflow-y-auto">
            {[
              { to: "/", label: "Home" },
              { to: "/editorial", label: "Editorial" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base py-3 px-4 rounded-lg transition-colors ${isActive
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-accent/50 opacity-80"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t">
            <Button asChild variant="hero" className="w-full py-6 rounded-xl shadow-lg">
              <a href="#latest" onClick={() => setMobileMenuOpen(false)}>
                Latest News
              </a>
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} Kerala Today News
            </p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SiteHeader;

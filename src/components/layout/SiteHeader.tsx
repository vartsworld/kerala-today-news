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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 left-0 right-0 ${scrolled
        ? "bg-background/95 backdrop-blur-md shadow-md py-1"
        : "bg-background border-b py-0"
        }`}
    >
      <div className="container mx-auto px-4 flex h-16 sm:h-20 items-center justify-between relative">
        <Link to="/" className="z-10 shrink-0" aria-label="Kerala Today News home">
          <img src="/lovable-uploads/kerala-today-logo.png" alt="Kerala Today News logo" className="h-10 w-auto sm:h-14 rounded" />
        </Link>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center w-full max-w-[200px] sm:max-w-none">
          <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-none">
            Kerala Today News
          </span>
          <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5 font-medium leading-none whitespace-nowrap">
            Your Daily News Source
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4 absolute right-4">
          <NavLink to="/" className={({ isActive }) => `text-sm sm:text-base ${isActive ? "opacity-100 font-medium" : "opacity-80 hover:opacity-100 transition-opacity"}`}>Home</NavLink>
          <NavLink to="/editorial" className={({ isActive }) => `text-sm sm:text-base ${isActive ? "opacity-100 font-medium" : "opacity-80 hover:opacity-100 transition-opacity"}`}>Editorial</NavLink>
          <Button asChild variant="hero" size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
            <a href="#latest" className="story-link" aria-label="Jump to latest">Latest</a>
          </Button>
          <ThemeToggle />
        </nav>

        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center gap-2 absolute right-4">
          <ThemeToggle />
          <button
            className="p-2 rounded-md hover:bg-accent transition-colors z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <nav
        className={`fixed top-0 right-0 h-full w-[280px] bg-background border-l z-50 shadow-2xl transition-transform duration-300 ease-in-out transform sm:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-4">
          <div className="flex flex-col gap-1 overflow-y-auto">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg flex items-center gap-3 ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/editorial"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg flex items-center gap-3 ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              Editorial
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              Terms & Conditions
            </NavLink>
            <NavLink
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-3 px-4 rounded-lg ${isActive ? "bg-primary/10 text-primary font-bold" : "hover:bg-accent/50 transition-colors opacity-80"}`}
            >
              Privacy Policy
            </NavLink>
          </div>

          <div className="mt-auto pt-6 border-t">
            <Button asChild variant="hero" className="w-full py-6 rounded-xl shadow-lg">
              <a href="#latest" onClick={() => setMobileMenuOpen(false)}>Latest News</a>
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} Kerala Today News
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;

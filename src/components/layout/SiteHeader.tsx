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
      className={`sticky top-0 z-40 w-full transition-all duration-700 ease-in-out left-0 right-0 ${scrolled
        ? "bg-background/95 backdrop-blur-md shadow-2xl rounded-b-[40px] sm:rounded-b-[60px] py-2 sm:py-3 border-none mx-auto max-w-[95%] sm:max-w-[90%] mt-2"
        : "bg-background border-b py-0 mx-auto max-w-full mt-0"
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
            className="p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="sm:hidden border-t bg-background/95 backdrop-blur animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-2 px-3 rounded-md ${isActive ? "bg-accent font-medium" : "hover:bg-accent/50 transition-colors"}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/editorial"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `text-base py-2 px-3 rounded-md ${isActive ? "bg-accent font-medium" : "hover:bg-accent/50 transition-colors"}`}
            >
              Editorial
            </NavLink>
            <a
              href="#latest"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base py-2 px-3 rounded-md bg-primary text-primary-foreground text-center font-medium"
            >
              Latest News
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;

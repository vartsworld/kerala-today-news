import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3" aria-label="Kerala Today News home">
          <img src="/lovable-uploads/kerala-today-logo.png" alt="Kerala Today News logo" className="h-8 w-auto sm:h-10 rounded" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Kerala Today News
            </span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-wide text-muted-foreground hidden xs:block">Your Daily News Source</span>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink to="/" className={({ isActive }) => `text-sm sm:text-base ${isActive ? "opacity-100" : "opacity-80 hover:opacity-100 transition-opacity"}`}>Home</NavLink>
          <NavLink to="/editorial" className={({ isActive }) => `text-sm sm:text-base ${isActive ? "opacity-100" : "opacity-80 hover:opacity-100 transition-opacity"}`}>Editorial</NavLink>
          <Button asChild variant="hero" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
            <a href="#latest" className="story-link" aria-label="Jump to latest">Latest</a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;

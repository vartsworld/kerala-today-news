
import { useEffect, useState } from "react";

const LOGO_URL = "/lovable-uploads/c2187b87-9b14-4702-94e6-b6f488f0d87e.png";

const IntroSplash = () => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Only show on home page
    if (window.location.pathname !== "/") return;

    // Check if intro has already been shown in this session
    const hasShownIntro = sessionStorage.getItem('achayans-intro-shown');
    if (hasShownIntro) {
      return;
    }

    // Mark immediately to avoid StrictMode double-invocation flicker
    sessionStorage.setItem('achayans-intro-shown', 'true');

    // Show the intro for first time visitors
    setVisible(true);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showTimer = setTimeout(() => setExiting(true), reduce ? 600 : 1600);
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, reduce ? 900 : 2200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Intro animation"
      className={`fixed inset-0 z-[60] grid place-items-center bg-background/90 ${exiting ? "animate-fade-out" : "animate-fade-in"} pointer-events-none`}
    >
      <div className="relative flex flex-col items-center text-center gap-4">
        <div className="relative">
          <img
            src={LOGO_URL}
            alt="Achayans Media logo"
            width={160}
            height={160}
            className="rounded-full shadow-md will-change-transform animate-scale-in"
          />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Achayans Media</h1>
        <p className="text-sm text-muted-foreground">News. Editorials. Updates.</p>
        <div className="mt-1 w-[280px] overflow-hidden rounded-full border bg-card text-card-foreground">
          <div className="whitespace-nowrap animate-ticker px-3 py-1 text-xs">
            Breaking • Achayans Media • Journalist & Media Associate Member
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSplash;

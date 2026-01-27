import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found — Achayans Media"
        description="The page you're looking for doesn't exist. Return to Achayans Media homepage for breaking news and editorials."
        canonical="/404"
      />
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
          <a href="/" className="underline underline-offset-4 hover:no-underline text-primary">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;

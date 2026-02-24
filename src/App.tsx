import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Editorial from "./pages/Editorial";
import Article from "./pages/Article";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import ScrollToTop from "./components/layout/ScrollToTop";
import IntroSplash from "./components/IntroSplash";
import StickyContactCTA from "./components/StickyContactCTA";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WriteEditorial from "./pages/admin/WriteEditorial";
import EditEditorial from "./pages/admin/EditEditorial";
import FacebookSettings from "./pages/admin/FacebookSettings";
import ProtectedAdmin from "./components/admin/ProtectedAdmin";

import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <HelmetProvider>
        <TooltipProvider>
          <IntroSplash />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <SiteHeader />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/editorial" element={<Editorial />} />
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
              <Route path="/admin/write" element={<ProtectedAdmin><WriteEditorial /></ProtectedAdmin>} />
              <Route path="/admin/edit/:id" element={<ProtectedAdmin><EditEditorial /></ProtectedAdmin>} />
              <Route path="/admin/facebook" element={<ProtectedAdmin><FacebookSettings /></ProtectedAdmin>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SiteFooter />
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

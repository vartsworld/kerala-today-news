import SEO from "@/components/SEO";
import AboutSection from "@/components/AboutSection";
import StickyContactCTA from "@/components/StickyContactCTA";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="About Us — Kerala Today News"
                description="Learn more about Kerala Today News, our mission, and our commitment to providing accurate reporting on all matters concerning Kerala."
            />

            {/* Breadcrumbs */}
            <nav className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">About Us</span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">About Kerala Today News</h1>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p className="text-xl text-foreground font-medium">
                        Kerala Today News is a premier digital news platform dedicated to providing comprehensive, accurate, and timely reporting on all matters concerning the vibrant state of Kerala and the Malayali diaspora worldwide.
                    </p>

                    <p>
                        Founded with a vision to deliver unbiased journalism, we bring you the latest breaking news, in-depth political analysis, cultural highlights, and community stories that matter most. Our team of experienced journalists and contributors work tirelessly to ensure that our readers stay informed about the rapidly changing landscape of Kerala.
                    </p>

                    <AboutSection />

                    <h2 className="text-2xl font-bold text-foreground mt-12">Our Mission</h2>
                    <p>
                        Our mission is to empower our audience with truthful information, foster informed public discourse, and celebrate the rich heritage and progressive spirit of Kerala. We believe in the power of journalism to drive positive change and hold those in power accountable.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-12">What We Cover</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Breaking news from all 14 districts of Kerala</li>
                        <li>In-depth analysis of Kerala politics and governance</li>
                        <li>Comprehensive coverage of Kerala's economy and business landscape</li>
                        <li>Cultural events, arts, and cinema (Mollywood) updates</li>
                        <li>Health, education, and social development stories</li>
                        <li>Sports highlights and achievements</li>
                    </ul>

                    <p className="mt-12">
                        Thank you for choosing Kerala Today News as your trusted daily news source. We are committed to evolving with our readers and leveraging modern technology to deliver news where you are.
                    </p>
                </div>
            </main>
            <StickyContactCTA />
        </div>
    );
};

export default About;

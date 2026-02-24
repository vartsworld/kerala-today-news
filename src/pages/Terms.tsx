import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Terms & Conditions — Kerala Today News"
                description="Read our terms and conditions for using the Kerala Today News platform."
            />

            <nav className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Terms & Conditions</span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
                <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Kerala Today News, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">2. Content Ownership</h2>
                        <p>
                            All content published on Kerala Today News, including articles, images, graphics, logos, and videos, is the property of Kerala Today News or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or transmit any content without prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">3. User Conduct</h2>
                        <p>
                            Users agree to use the website only for lawful purposes. You are prohibited from posting or transmitting any material that is defamatory, obscene, indecent, abusive, offensive, harassing, or otherwise unlawful.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">4. External Links</h2>
                        <p>
                            Our website may contain links to third-party websites including Facebook and other social media platforms. Kerala Today News has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">5. Disclaimer of Warranties</h2>
                        <p>
                            The materials on Kerala Today News are provided "as is". We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
                        <p>
                            In no event shall Kerala Today News or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Terms;

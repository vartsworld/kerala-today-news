import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Privacy Policy — Kerala Today News"
                description="Understand how Kerala Today News collects, uses, and protects your personal information."
            />

            <nav className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">
                            <Home className="h-4 w-4" />
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">Privacy Policy</span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
                        <p>
                            At Kerala Today News, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
                        <p>
                            We may collect several types of information from and about users of our website, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Direct identification information such as name and email address when you contact us.</li>
                            <li>Usage details, IP addresses, and information collected through cookies.</li>
                            <li>Data from our Facebook integration as per Facebook's data usage policies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">3. How We Use Your Information</h2>
                        <p>
                            We use information that we collect about you or that you provide to us:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To present our website and its contents to you.</li>
                            <li>To provide you with information or services that you request from us.</li>
                            <li>To fulfill any other purpose for which you provide it.</li>
                            <li>To notify you about changes to our website or any products or services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
                        <p>
                            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. However, the transmission of information via the internet is not completely secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">5. Third-Party Services</h2>
                        <p>
                            Our service connects to Facebook to fetch and display news content. These third-party services have their own privacy policies, and we recommend that you read them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground">6. Cookies</h2>
                        <p>
                            Our website uses cookies to enhance your browsing experience. You can set your browser to refuse all or some browser cookies, but some parts of this website may then be inaccessible or not function properly.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Privacy;

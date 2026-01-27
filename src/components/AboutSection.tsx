import { Separator } from "@/components/ui/separator";

const AboutSection = () => {
  return (
    <section id="about" className="container mx-auto py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 rounded-lg border bg-card text-card-foreground p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight">About Achayans Media</h2>
          <Separator className="my-4" />
          <p className="text-muted-foreground">
            Achayans Media brings timely news, field reports, and community stories with integrity and clarity.
            We are proud to be a Journalist & Media Associate Member, committed to responsible journalism.
          </p>
        </article>
        <aside className="rounded-lg border bg-muted/30 p-6">
          <h3 className="font-semibold">Contact</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            For tips and coverage, reach out via our contact banner or social channels.
          </p>
        </aside>
      </div>
    </section>
  );
};
export default AboutSection;
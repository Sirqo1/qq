import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, Layers, Search, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight font-headline mb-6 md:text-5xl">
        Welcome to <span className="text-primary">StudySmarter</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
        Your intelligent assistant for creating, organizing, and practicing flashcards. Deepen your understanding and ace your exams!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        <FeatureCard
          icon={<Layers className="w-10 h-10 text-primary mb-4" />}
          title="Organize with Decks"
          description="Group your flashcards into subjects or topics for focused learning."
          link="/decks"
          linkLabel="View Decks"
        />
        <FeatureCard
          icon={<FilePlus2 className="w-10 h-10 text-primary mb-4" />}
          title="Create Flashcards"
          description="Easily create new flashcards with questions and answers."
          link="/decks" // Link to decks, user can create card from there
          linkLabel="Add Flashcards"
        />
        <FeatureCard
          icon={<Zap className="w-10 h-10 text-primary mb-4" />}
          title="Practice Smart"
          description="Practice your flashcards sequentially or randomly to reinforce learning."
          link="/practice"
          linkLabel="Start Practicing"
        />
      </div>

      <Button asChild size="lg">
        <Link href="/decks">Get Started</Link>
      </Button>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

function FeatureCard({ icon, title, description, link, linkLabel }: FeatureCardProps) {
  return (
    <Card className="text-left shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        {icon}
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">{description}</CardDescription>
        <Button variant="link" asChild className="p-0 text-primary">
          <Link href={link}>{linkLabel} &rarr;</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

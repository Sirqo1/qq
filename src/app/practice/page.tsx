"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudyApp } from '@/contexts/StudyAppContext';
import { Layers, PlayCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function PracticePage() {
  const { decks, getFlashcardsByDeckId, loading } = useStudyApp();

  if (loading) {
    return (
       <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center font-headline">Practice Flashcards</h1>
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
      </div>
    );
  }

  const decksWithFlashcards = decks.filter(deck => getFlashcardsByDeckId(deck.id).length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Practice Flashcards</h1>
      
      {decksWithFlashcards.length === 0 ? (
        <Card className="text-center py-10">
          <CardHeader>
            <Zap size={48} className="mx-auto text-primary mb-4" />
            <CardTitle>No Decks to Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to create some decks and add flashcards before you can practice.
            </p>
            <Button asChild>
              <Link href="/decks/new">Create a Deck</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-lg text-center text-muted-foreground mb-6">
            Choose a deck below to start your practice session.
          </p>
          {decksWithFlashcards.map(deck => (
            <Card key={deck.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-xl">{deck.name}</CardTitle>
                  <CardDescription>{getFlashcardsByDeckId(deck.id).length} cards</CardDescription>
                </div>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={`/decks/${deck.id}/practice`}>
                    <PlayCircle className="mr-2 h-4 w-4" /> Practice This Deck
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
       {decks.length > 0 && decksWithFlashcards.length === 0 && (
         <Card className="text-center py-10">
          <CardHeader>
            <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
            <CardTitle>Add Flashcards to Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You have decks, but they don't have any flashcards yet. Add some cards to start practicing!
            </p>
            <Button asChild variant="outline">
              <Link href="/decks">Go to My Decks</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

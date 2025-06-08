"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DeckItem } from '@/components/decks/DeckItem';
import { useStudyApp } from '@/contexts/StudyAppContext';
import { PlusCircle, Layers } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DecksPage() {
  const { decks, getFlashcardsByDeckId, loading } = useStudyApp();

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline">Your Decks</h1>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Decks</h1>
        <Button asChild>
          <Link href="/decks/new" className="flex items-center gap-2">
            <PlusCircle size={20} /> Create New Deck
          </Link>
        </Button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Decks Yet</h2>
          <p className="text-muted-foreground mb-4">Get started by creating your first deck of flashcards.</p>
          <Button asChild>
            <Link href="/decks/new">Create Your First Deck</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {decks.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(deck => (
            <DeckItem key={deck.id} deck={deck} flashcardCount={getFlashcardsByDeckId(deck.id).length} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </div>
  );
}

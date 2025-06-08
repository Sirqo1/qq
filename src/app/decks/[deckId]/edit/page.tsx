"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DeckForm } from '@/components/decks/DeckForm';
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Deck } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const { getDeckById, updateDeck, loading } = useStudyApp();
  const [initialData, setInitialData] = useState<Deck | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && deckId) {
      const deck = getDeckById(deckId);
      if (deck) {
        setInitialData(deck);
      } else {
        // Deck not found, redirect
        router.replace('/decks');
      }
    }
  }, [deckId, getDeckById, loading, router]);

  const handleSubmit = (values: Pick<Deck, 'name' | 'description'>) => {
    if (!deckId) return;
    setIsSubmitting(true);
    try {
      updateDeck(deckId, values);
      router.push(`/decks/${deckId}`);
    } catch (error) {
      console.error("Failed to update deck:", error);
      setIsSubmitting(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="max-w-lg mx-auto space-y-6 mt-8">
         <Skeleton className="h-10 w-36 mb-4" /> {/* Back button */}
        <Skeleton className="h-8 w-1/2" /> {/* Title */}
        <Skeleton className="h-10 w-full" /> {/* Input Name */}
        <Skeleton className="h-24 w-full" /> {/* Textarea Description */}
        <Skeleton className="h-10 w-full" /> {/* Submit Button */}
      </div>
    );
  }

  return (
    <div>
      <Button asChild variant="outline" className="mb-6">
        <Link href={`/decks/${deckId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck
        </Link>
      </Button>
      <DeckForm onSubmit={handleSubmit} initialData={initialData} isSubmitting={isSubmitting} />
    </div>
  );
}

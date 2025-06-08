"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FlashcardForm } from '@/components/flashcards/FlashcardForm';
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  const flashcardId = params.flashcardId as string;

  const { getFlashcardById, updateFlashcard, getDeckById, loading } = useStudyApp();
  const [initialData, setInitialData] = useState<Pick<Flashcard, 'question' | 'answer'> | null>(null);
  const [deckName, setDeckName] = useState<string | undefined>(undefined);
  const [deckIdFoReturn, setDeckIdForReturn] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && flashcardId) {
      const flashcard = getFlashcardById(flashcardId);
      if (flashcard) {
        setInitialData({ question: flashcard.question, answer: flashcard.answer });
        setDeckIdForReturn(flashcard.deckId);
        const deck = getDeckById(flashcard.deckId);
        setDeckName(deck?.name);
      } else {
        // Flashcard not found, redirect
        router.replace('/decks'); // Or a more specific error page
      }
    }
  }, [flashcardId, getFlashcardById, getDeckById, loading, router]);

  const handleSubmit = (values: Pick<Flashcard, 'question' | 'answer'>) => {
    if (!flashcardId) return;
    setIsSubmitting(true);
    try {
      updateFlashcard(flashcardId, values);
      if (deckIdFoReturn) {
        router.push(`/decks/${deckIdFoReturn}`);
      } else {
        router.push('/decks');
      }
    } catch (error) {
      console.error("Failed to update flashcard:", error);
      setIsSubmitting(false);
    }
  };

  if (loading || !initialData) {
     return (
      <div className="max-w-xl mx-auto space-y-6 mt-8">
        <Skeleton className="h-10 w-48 mb-4" /> {/* Back button */}
        <Skeleton className="h-8 w-3/4" /> {/* Title */}
        <Skeleton className="h-24 w-full" /> {/* Question Textarea */}
        <Skeleton className="h-32 w-full" /> {/* Answer Textarea */}
        <Skeleton className="h-10 w-full" /> {/* Submit Button */}
      </div>
    );
  }

  return (
    <div>
      {deckIdFoReturn && (
        <Button asChild variant="outline" className="mb-6">
          <Link href={`/decks/${deckIdFoReturn}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck {deckName ? `"${deckName}"` : ''}
          </Link>
        </Button>
      )}
      <FlashcardForm 
        onSubmit={handleSubmit} 
        initialData={initialData} 
        isSubmitting={isSubmitting}
        deckName={deckName} 
      />
    </div>
  );
}

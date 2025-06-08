"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FlashcardForm } from '@/components/flashcards/FlashcardForm';
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;
  
  const { addFlashcard, getDeckById, loading } = useStudyApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deck = getDeckById(deckId);

  if (loading) {
    return <div className="text-center p-10">Loading deck information...</div>;
  }

  if (!deck) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-4">Deck not found</h2>
        <p className="text-muted-foreground mb-6">The deck you're trying to add a flashcard to does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/decks">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back to Decks
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (values: Pick<Flashcard, 'question' | 'answer'>) => {
    setIsSubmitting(true);
    try {
      addFlashcard({ ...values, deckId });
      // router.push(`/decks/${deckId}`); // Or stay on page to add more
      // For simplicity, let's redirect back to deck page
      router.push(`/decks/${deckId}`);
    } catch (error) {
      console.error("Failed to create flashcard:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <Button asChild variant="outline" className="mb-6">
        <Link href={`/decks/${deckId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck "{deck.name}"
        </Link>
      </Button>
      <FlashcardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} deckName={deck.name} />
    </div>
  );
}

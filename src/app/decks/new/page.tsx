"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeckForm } from '@/components/decks/DeckForm';
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Deck } from '@/types';

export default function NewDeckPage() {
  const router = useRouter();
  const { addDeck } = useStudyApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: Pick<Deck, 'name' | 'description'>) => {
    setIsSubmitting(true);
    try {
      const newDeck = addDeck(values);
      router.push(`/decks/${newDeck.id}`);
    } catch (error) {
      console.error("Failed to create deck:", error);
      // Consider adding a toast message for error
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DeckForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type { Deck, Flashcard } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";

interface StudyAppContextType {
  decks: Deck[];
  flashcards: Flashcard[];
  loading: boolean;
  addDeck: (deckData: Pick<Deck, 'name' | 'description'>) => Deck;
  updateDeck: (deckId: string, deckData: Partial<Pick<Deck, 'name' | 'description'>>) => void;
  deleteDeck: (deckId: string) => void;
  getDeckById: (deckId: string) => Deck | undefined;
  getFlashcardsByDeckId: (deckId: string) => Flashcard[];
  addFlashcard: (flashcardData: Pick<Flashcard, 'question' | 'answer' | 'deckId'>) => Flashcard;
  updateFlashcard: (flashcardId: string, flashcardData: Partial<Pick<Flashcard, 'question' | 'answer'>>) => void;
  deleteFlashcard: (flashcardId: string) => void;
  getFlashcardById: (flashcardId: string) => Flashcard | undefined;
  searchFlashcards: (query: string) => Flashcard[];
}

const StudyAppContext = createContext<StudyAppContextType | undefined>(undefined);

export function StudyAppProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks, loadingDecks] = useLocalStorage<Deck[]>('studySmarter_decks', []);
  const [flashcards, setFlashcards, loadingFlashcards] = useLocalStorage<Flashcard[]>('studySmarter_flashcards', []);
  const { toast } = useToast();

  const loading = loadingDecks || loadingFlashcards;

  const addDeck = (deckData: Pick<Deck, 'name' | 'description'>): Deck => {
    const newDeck: Deck = {
      ...deckData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDecks(prevDecks => [...prevDecks, newDeck]);
    toast({ title: "Deck Created", description: `Deck "${newDeck.name}" has been successfully created.` });
    return newDeck;
  };

  const updateDeck = (deckId: string, deckData: Partial<Pick<Deck, 'name' | 'description'>>) => {
    setDecks(prevDecks =>
      prevDecks.map(deck =>
        deck.id === deckId ? { ...deck, ...deckData, updatedAt: new Date().toISOString() } : deck
      )
    );
    toast({ title: "Deck Updated", description: `Deck has been successfully updated.` });
  };

  const deleteDeck = (deckId: string) => {
    setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
    setFlashcards(prevFlashcards => prevFlashcards.filter(fc => fc.deckId !== deckId)); // Also delete associated flashcards
    toast({ title: "Deck Deleted", description: "Deck and its flashcards have been deleted.", variant: "destructive" });
  };

  const getDeckById = (deckId: string): Deck | undefined => {
    return decks.find(deck => deck.id === deckId);
  };
  
  const getFlashcardsByDeckId = (deckId: string): Flashcard[] => {
    return flashcards.filter(flashcard => flashcard.deckId === deckId);
  };

  const addFlashcard = (flashcardData: Pick<Flashcard, 'question' | 'answer' | 'deckId'>): Flashcard => {
    const newFlashcard: Flashcard = {
      ...flashcardData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFlashcards(prevFlashcards => [...prevFlashcards, newFlashcard]);
    toast({ title: "Flashcard Added", description: `Flashcard has been successfully added.` });
    return newFlashcard;
  };

  const updateFlashcard = (flashcardId: string, flashcardData: Partial<Pick<Flashcard, 'question' | 'answer'>>) => {
    setFlashcards(prevFlashcards =>
      prevFlashcards.map(fc =>
        fc.id === flashcardId ? { ...fc, ...flashcardData, updatedAt: new Date().toISOString() } : fc
      )
    );
    toast({ title: "Flashcard Updated", description: `Flashcard has been successfully updated.` });
  };

  const deleteFlashcard = (flashcardId: string) => {
    setFlashcards(prevFlashcards => prevFlashcards.filter(fc => fc.id !== flashcardId));
    toast({ title: "Flashcard Deleted", description: "Flashcard has been deleted.", variant: "destructive" });
  };
  
  const getFlashcardById = (flashcardId: string): Flashcard | undefined => {
    return flashcards.find(flashcard => flashcard.id === flashcardId);
  };

  const searchFlashcards = (query: string): Flashcard[] => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return flashcards.filter(
      fc => fc.question.toLowerCase().includes(lowerQuery) || fc.answer.toLowerCase().includes(lowerQuery)
    );
  };

  const value = useMemo(() => ({
    decks,
    flashcards,
    loading,
    addDeck,
    updateDeck,
    deleteDeck,
    getDeckById,
    getFlashcardsByDeckId,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardById,
    searchFlashcards,
  }), [decks, flashcards, loading]);

  return <StudyAppContext.Provider value={value}>{children}</StudyAppContext.Provider>;
}

export function useStudyApp() {
  const context = useContext(StudyAppContext);
  if (context === undefined) {
    throw new Error('useStudyApp must be used within a StudyAppProvider');
  }
  return context;
}

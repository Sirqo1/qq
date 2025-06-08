"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Shuffle, RefreshCw, Sparkles, Eye, ArrowLeftCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ConceptExpansionDialog } from '@/components/ai/ConceptExpansionDialog';

export default function DeckPracticePage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const { getDeckById, getFlashcardsByDeckId, loading } = useStudyApp();
  
  const [deckName, setDeckName] = useState('');
  const [allFlashcards, setAllFlashcards] = useState<Flashcard[]>([]);
  const [practiceFlashcards, setPracticeFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isExpansionDialogOpen, setIsExpansionDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && deckId) {
      const currentDeck = getDeckById(deckId);
      if (currentDeck) {
        setDeckName(currentDeck.name);
        const fetchedFlashcards = getFlashcardsByDeckId(deckId);
        setAllFlashcards(fetchedFlashcards);
        setPracticeFlashcards(fetchedFlashcards); // Initially not shuffled
        setCurrentIndex(0);
        setShowAnswer(false);
      } else {
        router.push('/decks'); // Deck not found
      }
    }
  }, [deckId, getDeckById, getFlashcardsByDeckId, loading, router]);

  const currentFlashcard = useMemo(() => {
    return practiceFlashcards.length > 0 ? practiceFlashcards[currentIndex] : null;
  }, [practiceFlashcards, currentIndex]);

  const handleNext = () => {
    if (currentIndex < practiceFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const toggleShuffle = () => {
    const newIsShuffled = !isShuffled;
    setIsShuffled(newIsShuffled);
    if (newIsShuffled) {
      setPracticeFlashcards([...allFlashcards].sort(() => Math.random() - 0.5));
    } else {
      setPracticeFlashcards([...allFlashcards]);
    }
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" /> {/* Back button */}
        <Skeleton className="h-10 w-3/4 mb-4" /> {/* Deck title */}
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
          <CardContent className="min-h-[200px] space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
        <div className="flex justify-center gap-4">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    );
  }

  if (!currentDeck) {
    return (
       <div className="text-center p-10">
        <h2 className="text-2xl font-semibold mb-4">Deck not found or has no cards.</h2>
        <Button asChild variant="outline">
          <Link href="/decks">
            <ArrowLeftCircle className="mr-2 h-4 w-4" /> Go back to Decks
          </Link>
        </Button>
      </div>
    );
  }
  
  if (practiceFlashcards.length === 0) {
     return (
       <div className="text-center p-10 max-w-md mx-auto">
        <Card>
          <CardHeader>
             <CardTitle className="font-headline">No Flashcards in "{deckName}"</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">This deck is empty. Add some flashcards to start practicing.</p>
            <Button asChild>
              <Link href={`/decks/${deckId}`}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> View Deck & Add Cards
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto">
       <Button asChild variant="outline" className="mb-6">
          <Link href={`/decks/${deckId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deck "{deckName}"
          </Link>
        </Button>
      <h1 className="text-2xl font-bold mb-2 text-center font-headline">Practicing: {deckName}</h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Card {currentIndex + 1} of {practiceFlashcards.length}
      </p>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Question:</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[150px] text-xl flex items-center justify-center p-6">
          {currentFlashcard?.question}
        </CardContent>
      </Card>

      {showAnswer && currentFlashcard && (
        <Card className="mt-6 shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Answer:</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[100px] text-lg flex items-center justify-center p-6">
            {currentFlashcard.answer}
          </CardContent>
           <CardFooter>
            <Button variant="outline" size="sm" onClick={() => setIsExpansionDialogOpen(true)}>
              <Sparkles className="mr-2 h-4 w-4"/> Expand Concept
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Button onClick={handlePrev} disabled={currentIndex === 0} variant="outline" className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={() => setShowAnswer(s => !s)} variant="default" size="lg" className="w-full sm:w-auto order-first sm:order-none text-base">
          <Eye className="mr-2 h-4 w-4" /> {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === practiceFlashcards.length - 1} variant="outline" className="w-full sm:w-auto">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="mt-6 flex justify-center">
        <Button onClick={toggleShuffle} variant="ghost">
          <Shuffle className="mr-2 h-4 w-4" /> {isShuffled ? "Unshuffle" : "Shuffle Cards"}
        </Button>
      </div>
      {currentFlashcard && (
         <ConceptExpansionDialog
            open={isExpansionDialogOpen}
            onOpenChange={setIsExpansionDialogOpen}
            concept={currentFlashcard.question}
            flashcardContent={`Question: ${currentFlashcard.question}\nAnswer: ${currentFlashcard.answer}`}
        />
      )}
    </div>
  );
}


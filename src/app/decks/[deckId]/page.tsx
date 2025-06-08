"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStudyApp } from '@/contexts/StudyAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit3, FilePlus2, Layers, PlayCircle, PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { FlashcardItem } from '@/components/flashcards/FlashcardItem';
import { useState, useEffect } from 'react';
import type { Flashcard } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FlashcardForm } from '@/components/flashcards/FlashcardForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger as RadixAlertDialogTrigger, // Renamed to avoid conflict
} from "@/components/ui/alert-dialog";


export default function DeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.deckId as string;

  const { getDeckById, getFlashcardsByDeckId, deleteDeck, addFlashcard, updateFlashcard, loading } = useStudyApp();
  
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  
  const [isEditingFlashcard, setIsEditingFlashcard] = useState<Flashcard | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!loading && deckId) {
      const currentDeck = getDeckById(deckId);
      if (currentDeck) {
        setDeckName(currentDeck.name);
        setDeckDescription(currentDeck.description || '');
        setFlashcards(getFlashcardsByDeckId(deckId));
      } else {
        // Handle deck not found, perhaps redirect
        router.push('/decks');
      }
    }
  }, [deckId, getDeckById, getFlashcardsByDeckId, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" /> {/* Back button */}
        <Skeleton className="h-12 w-3/4" /> {/* Title */}
        <Skeleton className="h-6 w-1/2" /> {/* Description */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full mt-4" /> {/* Add flashcard button */}
        <div className="space-y-4 mt-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  const currentDeck = getDeckById(deckId);
  if (!currentDeck) {
    // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return <div className="text-center p-10">Deck not found.</div>;
  }
  
  const sortedFlashcards = [...flashcards].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleEditFlashcard = (flashcardId: string) => {
    const flashcardToEdit = flashcards.find(fc => fc.id === flashcardId);
    if (flashcardToEdit) {
      setIsEditingFlashcard(flashcardToEdit);
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = (values: Pick<Flashcard, 'question' | 'answer'>) => {
    if (isEditingFlashcard) {
      updateFlashcard(isEditingFlashcard.id, values);
    } else {
      addFlashcard({ ...values, deckId });
    }
    setFlashcards(getFlashcardsByDeckId(deckId)); // Refresh list
    setIsFormOpen(false);
    setIsEditingFlashcard(null);
  };
  
  const handleOpenNewFlashcardForm = () => {
    setIsEditingFlashcard(null);
    setIsFormOpen(true);
  }

  const handleDeleteDeck = () => {
    deleteDeck(deckId);
    router.push('/decks');
  };

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="outline" className="mb-6">
          <Link href="/decks">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Decks
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{deckName}</h1>
            {deckDescription && <p className="mt-2 text-lg text-muted-foreground">{deckDescription}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/decks/${deckId}/edit`}><Edit3 className="mr-2 h-4 w-4" /> Edit Deck</Link>
            </Button>
            <RadixAlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Deck
              </Button>
            </RadixAlertDialogTrigger>
            <AlertDialog> {/* This AlertDialog is for Delete Deck */}
              <RadixAlertDialogTrigger asChild>
                 {/* This trigger is now a child, so it's okay. The one above is the actual trigger */}
              </RadixAlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the deck "{deckName}" and all its flashcards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteDeck} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    Delete Deck
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Flashcards ({flashcards.length})</CardTitle>
            <CardDescription>Manage the flashcards in this deck.</CardDescription>
          </div>
          <div className="flex gap-2">
             <Button onClick={handleOpenNewFlashcardForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Flashcard
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/decks/${deckId}/practice`}>
                <PlayCircle className="mr-2 h-4 w-4" /> Practice Deck
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedFlashcards.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <Layers size={40} className="mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold text-muted-foreground">No Flashcards Yet</h3>
              <p className="text-sm text-muted-foreground mb-3">Add your first flashcard to this deck.</p>
              <Button onClick={handleOpenNewFlashcardForm}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add First Flashcard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedFlashcards.map(flashcard => (
                <FlashcardItem key={flashcard.id} flashcard={flashcard} onEdit={handleEditFlashcard} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
        setIsFormOpen(isOpen);
        if (!isOpen) setIsEditingFlashcard(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{isEditingFlashcard ? 'Edit Flashcard' : 'Add New Flashcard'}</DialogTitle>
            <DialogDescription>
              {isEditingFlashcard ? 'Update the details of this flashcard.' : `Add a new flashcard to the deck "${deckName}".`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FlashcardForm 
              onSubmit={handleFormSubmit} 
              initialData={isEditingFlashcard ? { question: isEditingFlashcard.question, answer: isEditingFlashcard.answer } : null}
              deckName={deckName}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

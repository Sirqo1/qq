"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Deck } from "@/types";
import { Eye, Edit3, Trash2, PlayCircle, FilePlus2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useStudyApp } from '@/contexts/StudyAppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeckItemProps {
  deck: Deck;
  flashcardCount: number;
}

export function DeckItem({ deck, flashcardCount }: DeckItemProps) {
  const { deleteDeck } = useStudyApp();

  const handleDelete = () => {
    deleteDeck(deck.id);
  };

  return (
    <Card className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline hover:text-primary transition-colors">
            <Link href={`/decks/${deck.id}`}>{deck.name}</Link>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/decks/${deck.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Eye size={16} /> View Deck
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/decks/${deck.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                  <Edit3 size={16} /> Edit Deck
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href={`/decks/${deck.id}/flashcards/new`} className="flex items-center gap-2 cursor-pointer">
                  <FilePlus2 size={16} /> Add Flashcard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <Trash2 size={16} /> Delete Deck
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this deck?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the deck "{deck.name}" and all its associated flashcards.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {deck.description && <CardDescription className="mt-1 line-clamp-2">{deck.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {flashcardCount} {flashcardCount === 1 ? 'card' : 'cards'}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" asChild size="sm">
          <Link href={`/decks/${deck.id}`} className="flex items-center gap-1">
            <Eye size={16} /> View
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/decks/${deck.id}/practice`} className="flex items-center gap-1">
             <PlayCircle size={16} /> Practice
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

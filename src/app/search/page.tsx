"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudyApp } from '@/contexts/StudyAppContext';
import type { Flashcard } from '@/types';
import Link from 'next/link';
import { SearchIcon, FileText, Layers } from 'lucide-react'; // Changed Search to SearchIcon to avoid name collision

export default function SearchPage() {
  const { searchFlashcards, getDeckById, loading } = useStudyApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Flashcard[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (loading) return;
    const foundFlashcards = searchFlashcards(searchTerm);
    setResults(foundFlashcards);
    setHasSearched(true);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
        setResults([]);
        setHasSearched(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center font-headline">Search Flashcards</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="Enter keyword to search questions or answers..."
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-grow"
        />
        <Button type="submit" disabled={loading || !searchTerm.trim()}>
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {loading && hasSearched && <p className="text-center text-muted-foreground">Searching...</p>}
      
      {!loading && hasSearched && results.length === 0 && (
        <Card className="text-center py-8">
          <CardHeader>
             <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We couldn't find any flashcards matching "{searchTerm}". Try a different keyword.
            </p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Found {results.length} {results.length === 1 ? "flashcard" : "flashcards"}
          </h2>
          {results.map(flashcard => {
            const deck = getDeckById(flashcard.deckId);
            return (
              <Card key={flashcard.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" /> 
                    {flashcard.question}
                  </CardTitle>
                  {deck && (
                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
                      <Layers className="h-3 w-3"/> In Deck: <Link href={`/decks/${deck.id}`} className="text-primary hover:underline">{deck.name}</Link>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-3">{flashcard.answer}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
       {!hasSearched && !loading && (
         <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <SearchIcon size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">Find Your Flashcards</h2>
          <p className="text-muted-foreground">Enter a keyword to search through all your flashcards.</p>
        </div>
      )}
    </div>
  );
}

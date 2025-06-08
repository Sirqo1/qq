"use client";

import { useState } from 'react';
import { expandConcept, type ConceptExpansionOutput } from '@/ai/flows/concept-expansion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ConceptExpansionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concept: string;
  flashcardContent: string;
}

export function ConceptExpansionDialog({
  open,
  onOpenChange,
  concept,
  flashcardContent,
}: ConceptExpansionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [expansionResult, setExpansionResult] = useState<ConceptExpansionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExpandConcept = async () => {
    setIsLoading(true);
    setError(null);
    setExpansionResult(null);
    try {
      const result = await expandConcept({ concept, flashcardContent });
      setExpansionResult(result);
    } catch (err) {
      console.error("Concept expansion failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Ensure the AI backend is running.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset state when dialog is closed/reopened
  useState(() => {
    if (open) {
      setExpansionResult(null);
      setError(null);
      setIsLoading(false);
    }
  });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Wand2 className="text-primary" /> Concept Expansion
          </DialogTitle>
          <DialogDescription>
            Explore related concepts to deepen your understanding of "{concept}".
          </DialogDescription>
        </DialogHeader>

        {!expansionResult && !isLoading && !error && (
            <div className="py-6 text-center">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Click the button below to get AI-powered suggestions for related concepts.</p>
                <Button onClick={handleExpandConcept}>
                    <Wand2 className="mr-2 h-4 w-4" /> Get Suggestions
                </Button>
            </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating insights...</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {expansionResult && (
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Related Concepts:</h3>
              {expansionResult.relatedConcepts.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {expansionResult.relatedConcepts.map((rc, index) => (
                    <li key={index} className="text-sm">{rc}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific related concepts found.</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary">Explanation:</h3>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                {expansionResult.explanation}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="mt-2">
          {expansionResult && !isLoading && (
             <Button onClick={handleExpandConcept} variant="outline">
                <Wand2 className="mr-2 h-4 w-4" /> Regenerate
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

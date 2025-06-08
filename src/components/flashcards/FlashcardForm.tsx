"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Flashcard } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const flashcardFormSchema = z.object({
  question: z.string().min(1, "Question is required").max(1000, "Question must be 1000 characters or less"),
  answer: z.string().min(1, "Answer is required").max(2000, "Answer must be 2000 characters or less"),
});

type FlashcardFormValues = z.infer<typeof flashcardFormSchema>;

interface FlashcardFormProps {
  onSubmit: (values: FlashcardFormValues) => void;
  initialData?: Pick<Flashcard, 'question' | 'answer'> | null;
  isSubmitting?: boolean;
  deckName?: string;
}

export function FlashcardForm({ onSubmit, initialData, isSubmitting, deckName }: FlashcardFormProps) {
  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardFormSchema),
    defaultValues: {
      question: initialData?.question || "",
      answer: initialData?.answer || "",
    },
  });

  const cardTitle = initialData ? "Edit Flashcard" : `Add Flashcard${deckName ? ` to ${deckName}` : ''}`;
  const cardDescription = initialData ? "Update the question and answer of your flashcard." : "Enter the question and answer for your new flashcard.";
  const buttonText = initialData ? "Save Changes" : "Add Flashcard";

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What is the capital of France?"
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Paris"
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (initialData ? "Saving..." : "Adding...") : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

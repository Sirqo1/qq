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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Deck } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const deckFormSchema = z.object({
  name: z.string().min(1, "Deck name is required").max(100, "Deck name must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

type DeckFormValues = z.infer<typeof deckFormSchema>;

interface DeckFormProps {
  onSubmit: (values: DeckFormValues) => void;
  initialData?: Deck | null;
  isSubmitting?: boolean;
}

export function DeckForm({ onSubmit, initialData, isSubmitting }: DeckFormProps) {
  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const cardTitle = initialData ? "Edit Deck" : "Create New Deck";
  const cardDescription = initialData ? "Update the details of your deck." : "Fill in the details to create a new deck.";
  const buttonText = initialData ? "Save Changes" : "Create Deck";

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Biology Chapter 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what this deck covers."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (initialData ? "Saving..." : "Creating...") : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

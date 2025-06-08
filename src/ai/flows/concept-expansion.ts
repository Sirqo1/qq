'use server';
/**
 * @fileOverview AI-powered tool that suggests related concepts to deepen understanding based on flashcard content.
 *
 * - expandConcept - A function that handles the concept expansion process.
 * - ConceptExpansionInput - The input type for the expandConcept function.
 * - ConceptExpansionOutput - The return type for the expandConcept function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConceptExpansionInputSchema = z.object({
  concept: z.string().describe('The concept to expand on.'),
  flashcardContent: z.string().describe('The content of the flashcard.'),
});
export type ConceptExpansionInput = z.infer<typeof ConceptExpansionInputSchema>;

const ConceptExpansionOutputSchema = z.object({
  relatedConcepts: z.array(z.string()).describe('An array of related concepts.'),
  explanation: z.string().describe('A brief explanation of how the concepts are related.'),
});
export type ConceptExpansionOutput = z.infer<typeof ConceptExpansionOutputSchema>;

export async function expandConcept(input: ConceptExpansionInput): Promise<ConceptExpansionOutput> {
  return conceptExpansionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conceptExpansionPrompt',
  input: {schema: ConceptExpansionInputSchema},
  output: {schema: ConceptExpansionOutputSchema},
  prompt: `You are an expert in explaining complex concepts to students.

  Given a concept and the content of a flashcard, suggest related concepts that would deepen the student's understanding of the subject matter.

  Concept: {{{concept}}}
  Flashcard Content: {{{flashcardContent}}}

  Format the output as a JSON object with 'relatedConcepts' (an array of related concepts) and 'explanation' (a brief explanation of how the concepts are related).`,
});

const conceptExpansionFlow = ai.defineFlow(
  {
    name: 'conceptExpansionFlow',
    inputSchema: ConceptExpansionInputSchema,
    outputSchema: ConceptExpansionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

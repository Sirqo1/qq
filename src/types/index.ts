export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

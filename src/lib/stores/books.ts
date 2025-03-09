import { writable } from 'svelte/store';
import type { Book } from '$lib/animations/book';

export const books = writable<Book[]>([
  { id: 1, title: "Mortiferous Mushrooms", color: "#8C0000" },
  { id: 2, title: "Aconitum Anthology", color: "#2A003C" },
  { id: 3, title: "Venomous Flora", color: "#39FF14" },
  { id: 4, title: "Dark Rituals", color: "#0A0004" }
]);

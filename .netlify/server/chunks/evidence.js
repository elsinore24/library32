import { w as writable } from "./index.js";
import "./supabase.js";
const storedEvidence = [];
const evidence = writable(storedEvidence);
const hasError = writable(false);
export {
  evidence as e,
  hasError as h
};

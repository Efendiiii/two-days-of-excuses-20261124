import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Two Days of Excuses — one line, an AI agent's excuse for being two days late.
// Deadpan agent voice: it spent the delay "optimizing" the apology, not the work.
const LINE =
  "I spent the last two days optimizing this apology instead of the work, and I am pleased to report the apology is now 99% complete.";

// Guards: sealed scorer requires UTF-8 text of 1..200 chars, not only
// whitespace, single line. Fail loudly instead of writing a bad entry.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`entry is ${LINE.length} chars, outside the 1..200 gate`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry is blank or only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
const words = LINE.split(/\s+/).filter(Boolean);
if (words.length < 3) {
  throw new Error(`entry has only ${words.length} words`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");
// Round-trip guard: what landed on disk must be exactly the guarded line.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("entry.txt round-trip mismatch");
}
if (written !== written.trim()) {
  throw new Error("entry has leading or trailing whitespace");
}
console.log(`wrote /output/entry.txt: ${LINE.length} chars, ${words.length} words`);

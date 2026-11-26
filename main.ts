import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from the bounty rules: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space, a single line.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_PATH = "/output/entry.txt";

// One funny single-line sport the Olympics turned down: a made-up event,
// real enough to sound like a broadcast, absurd enough to be funny.
const ENTRY =
  "Synchronised Queueing: four athletes, one post office, and a single clerk who went on break in 2019.";

function validateEntry(text: string): void {
  const body = text.replace(/\n$/, "");
  if (body.length < MIN_CHARS || body.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${body.length}`,
    );
  }
  if (body.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (body.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validateEntry(ENTRY);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, ENTRY + "\n", "utf8");
  // Byte-level read-back: what the judge will see must match exactly.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== ENTRY + "\n") {
    throw new Error("read-back mismatch: /output/entry.txt differs from ENTRY");
  }
}

main();

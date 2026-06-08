# aikit

[![CI](https://github.com/ahmifte/aikit/actions/workflows/ci.yml/badge.svg)](https://github.com/ahmifte/aikit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)

Type-safe, **zero-dependency** TypeScript utilities for building LLM apps: text chunking for RAG, prompt templating, token estimation, and vector similarity. Small, tested, and tree-shakeable (ESM + CJS).

## Why?

Every LLM project re-implements the same handful of helpers. `aikit` collects the well-tested versions so you don't have to: no runtime dependencies, full types, and works in Node, the browser, and edge runtimes.

## Install

```bash
npm install @ahmifte/aikit
# or: pnpm add @ahmifte/aikit
```

## Usage

```ts
import {
  chunkText,
  buildPrompt,
  countTokens,
  truncateToTokenLimit,
  cosineSimilarity,
  topKSimilar,
} from "@ahmifte/aikit";

// Split a document into overlapping chunks for embedding.
const chunks = chunkText(longDocument, { chunkSize: 1000, overlap: 100 });

// Fill a prompt template — missing variables throw, so prompts never ship with holes.
const prompt = buildPrompt("Summarize this for {{audience}}:\n{{text}}", {
  audience: "executives",
  text: chunks[0],
});

// Budget tokens before calling the model.
if (countTokens(prompt) > 4000) {
  // ...trim context
}
const safe = truncateToTokenLimit(prompt, 4000);

// Rank retrieved chunks against a query embedding.
const ranked = topKSimilar(queryEmbedding, chunkEmbeddings, 5);
const score = cosineSimilarity(a, b);
```

## API

| Function | Description |
| --- | --- |
| `chunkText(text, { chunkSize?, overlap? })` | Word-boundary-aware overlapping chunks for RAG. |
| `buildPrompt(template, vars)` | Interpolate `{{ name }}` placeholders; throws on missing vars. |
| `countTokens(text, model?)` | Fast, dependency-free token estimate. |
| `truncateToTokenLimit(text, limit, model?)` | Trim text to fit a token budget. |
| `cosineSimilarity(a, b)` | Cosine similarity of two equal-length vectors. |
| `topKSimilar(query, candidates, topK?)` | Rank candidate vectors by similarity. |

> Note: `countTokens` is a heuristic estimate, not a model-exact BPE tokenizer. It is ideal for budgeting and truncation. For hard API limits, pair it with a real tokenizer.

## Development

```bash
pnpm install
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
pnpm build        # tsup -> dist (esm + cjs + types)
```

## License

MIT — see [LICENSE](./LICENSE).

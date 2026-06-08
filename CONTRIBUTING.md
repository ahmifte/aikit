# Contributing

Contributions are welcome — especially new, well-tested utilities that earn their place in a zero-dependency toolkit.

## Setup

```bash
pnpm install
pnpm test
```

## Guidelines

- Keep the package **zero runtime dependencies**.
- Every exported function needs tests and a JSDoc comment.
- Run `pnpm typecheck` and `pnpm test` before opening a pull request.
- Keep pull requests focused; open an issue first for larger additions.

# string-utility-types
Utility typescript types for strings

## Getting Started
```ts
npm install string-utility-types
```

## Documentation

### `GetMatchingPathPattern`

Returns the pattern from a list of path patterns that matches a given path.

#### Type Definition

```ts
export type GetMatchingPathPattern<TPath extends string, TPatterns extends string> = ...
```

#### Parameters

- `TPath` – The path you want to match (e.g. `'/books/123'`)
- `TPatterns` – A union of path patterns that may include parameters (e.g. `'/books/:id' | '/cars/:id'`)

#### How it works

Given a path and a union of pattern strings, this type returns the pattern (from the union) that matches the path. Path patterns can include named parameters with a leading colon (e.g., `:id`).

#### Example

```ts
import type { GetMatchingPathPattern } from 'string-utility-types'

type Path = '/cars/123'
type Patterns = '/books/:id' | '/cars/:id'

// Result: '/cars/:id'
type MatchingPattern = GetMatchingPathPattern<Path, Patterns>
```

Another example with more complex patterns:

```ts
type Path = '/cars/123/wheels'
type Patterns = '/cars/:id' | '/cars/:id/wheels'

// Result: '/cars/:id/wheels'
type MatchingPattern = GetMatchingPathPattern<Path, Patterns>
```

If no pattern matches, the resulting type is `never`.

#### Use Case

`GetMatchingPathPattern` is useful for extracting which template pattern a string path matches at the type level, such as in API route matching, router utilities, or type-safe string discriminator usage in TypeScript projects.


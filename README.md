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


---

### `PathPatternToTemplateLiteral`

Transforms a path pattern string (that may contain parameters such as `:id`) into a TypeScript template literal type where parameters are replaced with the `string` type.

#### Type Definition

```ts
export type PathPatternToTemplateLiteral<TPattern extends string> = ...
```

#### Parameters

- `TPattern` – The path pattern string, such as `'/books/:id'`, `'/cars/:carId/wheels/:wheelId'`, etc.

#### How it works

This type takes a pattern with named parameters (beginning with `:`) and turns it into a template string type with parameters replaced as `string`. This allows you to use the resulting type to represent all possible valid concrete paths for the given pattern.

#### Example

```ts
import type { PathPatternToTemplateLiteral } from 'string-utility-types'

type Pattern = '/books/:id'
// Result: '/books/${string}'
type PathString = PathPatternToTemplateLiteral<Pattern>

type ComplexPattern = '/cars/:carId/wheels/:wheelId'
// Result: '/cars/${string}/wheels/${string}'
type PathString2 = PathPatternToTemplateLiteral<ComplexPattern>
```

This is useful if you want to generate all valid path strings that match a given pattern, replacing parameter markers (`:name`) with `string`.

---

### `NoExtraPathSegments`

Determines, at the type level, whether a path string exactly matches one of a set of path patterns—disallowing any extra path segments that aren't present in the pattern. If the path matches one of the patterns exactly, the type resolves to the path; if there are extra segments or no match at all, it resolves to `never`.

#### Type Definition

```ts
export type NoExtraPathSegments<TPath extends string, TPatterns extends string> = ...
```

#### Parameters

- `TPath` – The path string you wish to validate, such as `'/books/123'`.
- `TPatterns` – A union of allowed path patterns, such as `'/books/:id' | '/books/:id/author'`.

#### How it works

It checks if the provided path string exactly matches any of the specified patterns (with parameters replaced by string values). If there are any extra segments or the path doesn't match any pattern, it results in a type error (i.e., resolves to `never`).

#### Example

```ts
import type { NoExtraPathSegments } from 'string-utility-types'

type Patterns = '/books/:id' | '/cars/:id'

// These are allowed:
NoExtraPathSegments<'/books/456', Patterns> // '/books/456'
NoExtraPathSegments<'/cars/123', Patterns>  // '/cars/123'

// These result in 'never' (type error):
NoExtraPathSegments<'/books/456/extra', Patterns> // never
NoExtraPathSegments<'/nonexistent/1', Patterns>   // never
```

This is especially useful for strict route matching or validating string paths in APIs, ensuring that only paths that exactly fit the allowed template patterns can be used or passed to functions at compile time.



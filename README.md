# string-utility-types
Utility typescript types for strings

## Getting Started
```ts
npm install string-utility-types
```

## Documentation

### `Split<S, Delimiter>`

Splits a string into an array of strings, using a delimiter.

**Type Parameters:**
- `S extends string` - The string to split
- `Delimiter extends string` - The delimiter to split on

**Example:**
```ts
type Result = Split<'a/b/c', '/'> // ['a', 'b', 'c']
type Empty = Split<'', '/'> // []
type Single = Split<'a', '/'> // ['a']
```

---

### `Join<Parts, Delimiter>`

Joins an array of strings into a string, using a delimiter.

**Type Parameters:**
- `Parts extends string[]` - The array of strings to join
- `Delimiter extends string` - The delimiter to join with

**Example:**
```ts
type Result = Join<['a', 'b', 'c'], '/'> // 'a/b/c'
type Empty = Join<[], '/'> // ''
type Single = Join<['a'], '/'> // 'a'
```

---

### `ReplaceAt<Arr, Index, New>`

Replaces the element at the given index in an array with a new value.

**Type Parameters:**
- `Arr extends any[]` - The array to modify
- `Index extends number` - The index at which to replace the element
- `New` - The new value to place at the index

**Example:**
```ts
type Result = ReplaceAt<['a', 'b', 'c'], 1, 'd'> // ['a', 'd', 'c']
type First = ReplaceAt<['a', 'b', 'c'], 0, 'x'> // ['x', 'b', 'c']
```

---

### `MatchesPathPattern<TPath, TPattern>`

Checks if a path may match a given path pattern. This method is conservative and may return `true` for more paths than you're expecting.

**Type Parameters:**
- `TPath extends string` - The path to check
- `TPattern extends string` - The path pattern to match against (e.g., `/books/:id`)

**Important Notes:**
- This method only works up to 6 path pattern parts
- This method is conservative - it may return `true` for paths that technically could match due to string interpolation
- For example, `MatchesPathPattern<`/books/${string}`, '/books/:id/author'>` returns `true` because `${string}` could be `/123/author`, which would match the pattern
- If you know that interpolated strings will never have slashes, consider using `MatchesPathPatternLax` instead

**Example:**
```ts
// Exact matches
type Match1 = MatchesPathPattern<'/books/123', '/books/:id'> // true
type Match2 = MatchesPathPattern<'/books', '/books'> // true

// Conservative matches (may be true even if not exact)
type Match3 = MatchesPathPattern<`/books/${string}`, '/books/:id/author'> // true
type Match4 = MatchesPathPattern<string, '/books/:id'> // true

// Non-matches
type NoMatch1 = MatchesPathPattern<'', '/books'> // false
type NoMatch2 = MatchesPathPattern<'/cars', '/books'> // false
type NoMatch3 = MatchesPathPattern<'/books/123/extra', '/books/:id'> // false
```

---

### `MatchesPathPatternLax<TPath, TPattern>`

Similar to `MatchesPathPattern`, but assumes that all string interpolations are valid path segments and have no slashes. By making this assumption (hence "Lax"), it can provide narrower matching than `MatchesPathPattern`.

**Type Parameters:**
- `TPath extends string` - The path to check
- `TPattern extends string` - The path pattern to match against

**Important Notes:**
- This method assumes interpolated strings contain no slashes
- It's not fully type-safe because of this assumption
- Should generally only be used when you can guarantee at runtime that all interpolated strings are valid path segments
- Unlike `MatchesPathPattern`, this will return `false` for cases where string interpolation could theoretically match but contains slashes

**Example:**
```ts
// Exact matches
type Match1 = MatchesPathPatternLax<'/123', '/:id'> // true
type Match2 = MatchesPathPatternLax<'/books/123', '/books/:id'> // true
type Match3 = MatchesPathPatternLax<'/books/123/authors', '/books/:id/authors'> // true

// Non-matches
type NoMatch1 = MatchesPathPatternLax<'/', '/:id'> // false
type NoMatch2 = MatchesPathPatternLax<'/123/', '/:id'> // false
type NoMatch3 = MatchesPathPatternLax<'/123/authors', '/:id'> // false
type NoMatch4 = MatchesPathPatternLax<'/books', '/books/:id'> // false
type NoMatch5 = MatchesPathPatternLax<'/books/123/extra', '/books/:id'> // false
```

---

### `GetMatchingPathPattern<TPath, TPatterns>`

Given a path and a union of path patterns, returns the set of patterns that may match the path. This method is conservative and may return more patterns than you're expecting.

**Type Parameters:**
- `TPath extends string` - The path to check
- `TPatterns extends string` - A union of path patterns to match against

**Important Notes:**
- This method is conservative - it may return more patterns than you're expecting
- For example, `GetMatchingPathPattern<`/books/${typeof myId}`, '/books/:id' | '/books/:id/author'>` may return both patterns because `myId` could theoretically be `/123/authors`
- If you know interpolated strings will never have slashes, consider using `GetMatchingPathPatternLax` instead

**Example:**
```ts
type Result = GetMatchingPathPattern<`/books/${string}`, '/books/:id' | '/books/:id/author'>
// Result: '/books/:id' | '/books/:id/author'
```

---

### `GetMatchingPathPatternLax<TPath, TPatterns>`

Similar to `GetMatchingPathPattern`, but assumes that all string interpolations in the path do not have any slashes. By making this assumption (hence "Lax"), it can provide narrower matching than `GetMatchingPathPattern`.

**Type Parameters:**
- `TPath extends string` - The path to check
- `TPatterns extends string` - A union of path patterns to match against

**Important Notes:**
- This method assumes interpolated strings contain no slashes
- For example, `GetMatchingPathPatternLax<`/books/${typeof myId}`, '/books/:id' | '/books/:id/author'>` will only return `/books/:id` because it assumes `myId` has no slashes

**Example:**
```ts
type Result = GetMatchingPathPatternLax<`/books/${string}`, '/books/:id' | '/books/:id/author'>
// Result: '/books/:id'
```

---

### `PathPatternToTemplateLiteral<TPattern>`

Converts a path pattern to a template literal by replacing placeholders (e.g., `:id`) with `${string}`.

**Type Parameters:**
- `TPattern extends string` - The path pattern to convert

**Important Notes:**
- The resulting template literal is not exactly equivalent to the original pattern
- For example, `/books/${string}` would allow paths like `/books/123/author`, while `/books/:id` would not
- If you want to enforce that users do not pass any extra path segments after the template literal, combine this with `NoExtraPathSegments`

**Example:**
```ts
type Result = PathPatternToTemplateLiteral<'/books/:id'> // '/books/${string}'
type Result2 = PathPatternToTemplateLiteral<'/books/:id/authors/:id'> // '/books/${string}/authors/${string}'
```

---

### `NoExtraPathSegments<TPath, TPatterns>`

Returns `never` if the path has any extra path segments after matching any of the template literals derived from the patterns, otherwise returns the path.

**Type Parameters:**
- `TPath extends string` - The path to validate
- `TPatterns extends string` - A union of path patterns to check against

**Example:**
```ts
// Valid paths (no extra segments)
type Valid1 = NoExtraPathSegments<'/books/123', '/books/:id'> // '/books/123'
type Valid2 = NoExtraPathSegments<'/books/123/author', '/books/:id/author'> // '/books/123/author'

// Invalid paths (extra segments)
type Invalid1 = NoExtraPathSegments<'/books/123/author', '/books/:id'> // never
type Invalid2 = NoExtraPathSegments<'/books/123/extra', '/books/:id'> // never
```

---

### `PathPatternParams<TPattern>`

Extracts placeholder parameters (e.g., `:id`, `:userId`) from a path pattern and constructs an object type whose keys are the parameter names and whose values are `string`. Supports multiple parameters.

**Type Parameters:**
- `TPattern extends string` — The path pattern (e.g., `'/books/:id/authors/:userId'`)

**Behavior:**
- Parameter placeholders (e.g., `:id`) are extracted as object keys with value type `string`.
- Patterns without parameters yield an empty object type.

**Example:**
```ts
type Params1 = PathPatternParams<'/books/:id'>                  // { id: string }
type Params2 = PathPatternParams<'/books/:bookId/authors/:id'>  // { bookId: string; id: string }
type Params3 = PathPatternParams<'/static/path'>                // {}
```

---

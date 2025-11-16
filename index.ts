export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

/**
 * Splits a string into an array of strings, using a delimiter
 * ```ts
 * Split<'a/b/c', '/'> // ['a', 'b', 'c']
 * ```
 */
export type Split<
  S extends string,
  Delimiter extends string
> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : S extends '' ? [] : [S];

/**
 * Joins an array of strings into a string, using a delimiter
 * ```ts
 * Join(['a', 'b', 'c'], '/') // 'a/b/c'
 * ```
 */
export type Join<
  Parts extends string[],
  Delimiter extends string
> = Parts extends []
  ? ''
  : Parts extends [infer Head extends string]
    ? Head
    : Parts extends [infer Head extends string, ...infer Tail extends string[]]
      ? `${Head}${Delimiter}${Join<Tail, Delimiter>}`
      : string;

/**
 * Replaces the element at the given index in an array with a new value
 * ```ts
 * ReplaceAt<['a', 'b', 'c'], 1, 'd'> // ['a', 'd', 'c']
 * ```
 */
export type ReplaceAt<
  Arr extends any[],
  Index extends number,
  New
> = Arr extends [infer Head, ...infer Tail]
  ? Index extends 0
    ? [New, ...Tail]
    : [Head, ...ReplaceAt<Tail, Subtract<Index, 1>, New>]
  : [];

type Subtract<A extends number, B extends number> = 
  BuildTuple<A> extends [...(infer U), ...BuildTuple<B>] ? U['length'] : never;

type BuildTuple<L extends number, T extends any[] = []> = 
  T['length'] extends L ? T : BuildTuple<L, [any, ...T]>;


/**
 * Checks if a path may match a given path pattern
 *
 * @note This method is conservative, and may return `true` for more paths than
 * you're expecting.  Take this example:
 * ```ts
 * MatchesPathPattern<`/books/${string}`, '/books/:id/author'> // true
 * ```
 * This would return `true` because `${string}` could be `/123/author`, in which
 * case it would match `/books/:id/author`.
 *
 * If you know that `${string}` will never have any slashes, you can consider
 * `MatchesPathPatternLax` instead, which would return `false` in the above
 * example
 * 
 * @note This method only works up to 6 path pattern parts.
 */
export type MatchesPathPattern<TPath extends string, TPattern extends string> = ResolveAllPlaceholders<TPath, TPattern> extends TPath ? true : false;

type ResolveFirstPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[1]> extends true ? 
        TPath extends `${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 1, R>, '/'> : 
        TPath extends `${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 1, R>, '/'> : 
        TPattern 
        :
    TPattern;

type ResolveSecondPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[2]> extends true ? 
        TPath extends `${string}/${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 2, R>, '/'> :
        TPath extends `${string}/${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 2, R>, '/'> : 
        TPattern 
        :
    TPattern;

type ResolveThirdPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[3]> extends true ? 
        TPath extends `${string}/${string}/${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 3, R>, '/'> : 
        TPath extends `${string}/${string}/${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 3, R>, '/'> : 
        TPattern 
        :
    TPattern;

type IsPlaceholder<T> = T extends `:${string}` ? true : false;

type ResolveAllPlaceholders<TPath extends string, TPattern extends string> = ResolveFirstPlaceholder<TPath, ResolveSecondPlaceholder<TPath, ResolveThirdPlaceholder<TPath, ResolveFourthPlaceholder<TPath, ResolveFifthPlaceholder<TPath, ResolveSixthPlaceholder<TPath, TPattern>>>>>>;

type ResolveFourthPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[4]> extends true ? 
        TPath extends `${string}/${string}/${string}/${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 4, R>, '/'> : 
        TPath extends `${string}/${string}/${string}/${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 4, R>, '/'> : 
        TPattern 
        :
    TPattern;

type ResolveFifthPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[5]> extends true ? 
        TPath extends `${string}/${string}/${string}/${string}/${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 5, R>, '/'> :     
        TPath extends `${string}/${string}/${string}/${string}/${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 5, R>, '/'> : 
        TPattern 
        :
    TPattern;

type ResolveSixthPlaceholder<TPath extends string, TPattern extends string> = 
    IsPlaceholder<GetPatternParts<TPattern>[6]> extends true ? 
        TPath extends `${string}/${string}/${string}/${string}/${string}/${string}/${infer R}/${string}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 6, R>, '/'> :     
        TPath extends `${string}/${string}/${string}/${string}/${string}/${string}/${infer R}` ? Join<ReplaceAt<GetPatternParts<TPattern>, 6, R>, '/'> : 
        TPattern 
        :
    TPattern;

type GetPatternParts<TPattern extends string> = Split<TPattern, '/'>;

/**
 * This is similar to MatchesPathPattern, but it assumes that all string
 * interpolations are valid path segments and have no slashes
 *
 * For example, if we have this pattern:
 * ```ts
 * MatchesPathPatternLax<`/books/${typeof myId}`, '/books/:id/authors'>
 * ```
 * Then `MatchesPathPatternLax` will return `false` because it assumes `myId`
 * has no slashes
 *
 * On the other hand, `MatchesPathPattern` will return `true`, because `myId`
 * could be `/123/authors`
 *
 * Note that `MatchesPathPatternLax` is not fully type safe because of this, and
 * it should generally only be used when you can guarantee at runtime that all
 * interpolated strings are valid path segments.
 * 
 */
export type MatchesPathPatternLax<TPath extends string, TPattern extends string> =
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}/${infer P5}/${infer P6}` ? MatchesSixPartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>, GetPart<P4>, GetPart<P5>, GetPart<P6>> : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}/${infer P5}` ? MatchesFivePartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>, GetPart<P4>, GetPart<P5>> : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}` ? MatchesFourPartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>, GetPart<P4>> : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}` ? MatchesThreePartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>> : 
    TPattern extends `/${infer P1}/${infer P2}` ? MatchesTwoPartPathPattern<TPath, GetPart<P1>, GetPart<P2>> : 
    TPattern extends `/${infer P1}` ? MatchesOnePartPathPattern<TPath, GetPart<P1>> : 
    false

type MatchesSixPartPathPattern<TPath extends string, TPart1 extends string, TPart2 extends string, TPart3 extends string, TPart4 extends string, TPart5 extends string, TPart6 extends string> = 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${TPart5}/` ? false : 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${TPart5}/${TPart6}` ? 
        TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${TPart5}/${TPart6}/${string}` ? false : true : 
    false

type MatchesFivePartPathPattern<TPath extends string, TPart1 extends string, TPart2 extends string, TPart3 extends string, TPart4 extends string, TPart5 extends string> = 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/` ? false : 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${TPart5}` ? 
        TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${TPart5}/${string}` ? false : true : 
    false

type MatchesFourPartPathPattern<TPath extends string, TPart1 extends string, TPart2 extends string, TPart3 extends string, TPart4 extends string> = 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/` ? false : 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}` ? 
        TPath extends `/${TPart1}/${TPart2}/${TPart3}/${TPart4}/${string}` ? false : true : 
    false

type MatchesThreePartPathPattern<TPath extends string, TPart1 extends string, TPart2 extends string, TPart3 extends string> = 
    TPath extends `/${TPart1}/${TPart2}/` ? false : 
    TPath extends `/${TPart1}/${TPart2}/${TPart3}` ? 
        TPath extends `/${TPart1}/${TPart2}/${TPart3}/${string}` ? false : true : 
    false

type MatchesTwoPartPathPattern<TPath extends string, TPart1 extends string, TPart2 extends string> = 
    TPath extends `/${TPart1}/` ? false : 
    TPath extends `/${TPart1}/${TPart2}` ? 
        TPath extends `/${TPart1}/${TPart2}/${string}` ? false : true : 
    false

type MatchesOnePartPathPattern<TPath extends string, TPart1 extends string> =
    TPath extends '/' ? false : 
    TPath extends `/${TPart1}` ? 
        TPath extends `/${TPart1}/${string}` ? false : true : 
    false

type GetPart<T extends string> = T extends `${string}/${string}` ? never : T extends `:${string}` ? string : T

/**
 * Given a path and a union of path patterns, returns the set of patterns that
 * may match the path.  Note that this method is conservative and may return
 * more patterns than you're expecting.  Take this example:
 * ```ts
 * GetMatchingPathPattern<`/books/${typeof myId}`, '/books/:id' | '/books/:id/author'>
 * ```
 * This would return both `/books/:id` and `/books/:id/author`.  This is
 * because, technically `myId` could be `/123/authors`, in which case it would
 * match `/books/:id/author`.
 *
 * If you know `myId` will never have slashes, you can consider
 * `GetMatchingPathPatternLax` instead, which would only return `/books/:id`
 * given the above example.
 */
export type GetMatchingPathPattern<TPath extends string, TPatterns extends string> = keyof PickByValue<{ [K in TPatterns]: MatchesPathPattern<TPath, K> }, true>

/**
 * This is similar to `GetMatchingPathPattern`, but it assumes that all string
 * interpolations in the path do not have any slashes. Take this example:
 * ```ts
 * GetMatchingPathPatternLax<`/books/${typeof myId}`, '/books/:id' | '/books/:id/author'>
 * ```
 * In this case, it would only return `/books/:id` because it assumes `myId`
 * does not have any slashes and therefore would never be something like
 * `/123/authors`.  
 *
 * If you want something more conservative/safer, you can consider
 * `GetMatchingPathPattern` instead.  `GetMatchingPathPattern` would return both
 * `/books/:id` and `/books/:id/author` given the above example.
 */
export type GetMatchingPathPatternLax<TPath extends string, TPatterns extends string> = keyof PickByValue<{ [K in TPatterns]: MatchesPathPatternLax<TPath, K> }, true>

type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

/**
 * Converts a path pattern to a template literal
 * 
 * @example
 * ```ts
 * PathPatternToTemplateLiteral<'/books/:id'> // '/books/${string}'
 * ```
 * 
 * Note that `/books/${string}` is not exactly equivalent to `/books/:id`,
 * because `/books/${string}` would also allow paths like `/books/123/author`,
 * while `/books/:id` would not.
 * 
 * If you want to enforce that users do not pass any extra path segments after
 * the template literal, you can combine this with `NoExtraPathSegments`.
 */
export type PathPatternToTemplateLiteral<TPattern extends string> =
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}/${infer P5}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}/${GetPart<P4>}/${GetPart<P5>}` : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}/${GetPart<P4>}` : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}` : 
    TPattern extends `/${infer P1}/${infer P2}` ? `/${GetPart<P1>}/${GetPart<P2>}` : 
    TPattern extends `/${infer P1}` ? `/${GetPart<P1>}` : 
    never

type MatchesAnyPattern<TPath extends string, TPatterns extends string> = keyof PickByValue<{ [Pattern in TPatterns]: MatchesPathPatternLax<TPath, Pattern> }, true> extends never ? false : true;

/**
 * Returns `never` if the path has any extra path segments after the template literal, otherwise returns the path
 * 
 * @example
 * ```ts
 * NoExtraPathSegments<'/books/123', '/books/:id'> // '/books/123'
 * NoExtraPathSegments<'/books/123/author', '/books/:id'> // never
 * ```
 */
export type NoExtraPathSegments<TPath extends string, TPatterns extends string> = MatchesAnyPattern<TPath, TPatterns> extends true ? TPath : TPath extends `${PathPatternToTemplateLiteral<TPatterns>}/${string}` ? never : TPath;

/**
 * Extracts all placeholders from a path pattern and returns an object type with keys as the placeholder names and values as string.
 * 
 * @example
 * ```ts
 * PathPatternParams<'/applications/:applicationId/users/:userId'> // { applicationId: string, userId: string }
 * PathPatternParams<'/books/:id'> // { id: string }
 * PathPatternParams<'/static/path'> // {}
 * ```
 */
export type PathPatternParams<TPattern extends string> = Prettify<
  TPattern extends `${string}:${infer Param}/${infer Rest}` 
    ? { [K in Param extends `${infer Name}?` ? Name : Param]: string } & PathPatternParams<`/${Rest}`>
    : TPattern extends `${string}:${infer Param}`
      ? { [K in Param extends `${infer Name}?` ? Name : Param]: string }
      : {}>;

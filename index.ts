export type MatchesPathPattern<TPath extends string, TPattern extends string> =
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}/${infer P5}` ? MatchesFivePartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>, GetPart<P4>, GetPart<P5>> : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}` ? MatchesFourPartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>, GetPart<P4>> : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}` ? MatchesThreePartPathPattern<TPath, GetPart<P1>, GetPart<P2>, GetPart<P3>> : 
    TPattern extends `/${infer P1}/${infer P2}` ? MatchesTwoPartPathPattern<TPath, GetPart<P1>, GetPart<P2>> : 
    TPattern extends `/${infer P1}` ? MatchesOnePartPathPattern<TPath, GetPart<P1>> : 
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

export type GetMatchingPathPattern<TPath extends string, TPatterns extends string> = keyof PickByValue<{ [K in TPatterns]: MatchesPathPattern<TPath, K> }, true>

type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>

export type PathPatternToTemplateLiteral<TPattern extends string> =
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}/${infer P5}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}/${GetPart<P4>}/${GetPart<P5>}` : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}/${infer P4}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}/${GetPart<P4>}` : 
    TPattern extends `/${infer P1}/${infer P2}/${infer P3}` ? `/${GetPart<P1>}/${GetPart<P2>}/${GetPart<P3>}` : 
    TPattern extends `/${infer P1}/${infer P2}` ? `/${GetPart<P1>}/${GetPart<P2>}` : 
    TPattern extends `/${infer P1}` ? `/${GetPart<P1>}` : 
    never

type MatchesAnyPattern<TPath extends string, TPatterns extends string> = keyof PickByValue<{ [Pattern in TPatterns]: MatchesPathPattern<TPath, Pattern> }, true> extends never ? false : true;

export type NoExtraPathSegments<TPath extends string, TPatterns extends string> = MatchesAnyPattern<TPath, TPatterns> extends true ? TPath : TPath extends `${PathPatternToTemplateLiteral<TPatterns>}/${string}` ? never : TPath;


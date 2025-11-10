import { describe, test, assertType } from 'vitest'
import type { GetMatchingPathPatternLax, PathPatternToTemplateLiteral, NoExtraPathSegments, MatchesPathPattern, MatchesPathPatternLax, GetMatchingPathPattern } from './index.ts'

describe('MatchesPathPatternLax', () => {
    test('1 part path pattern', () => {
        assertType<MatchesPathPatternLax<'/123', '/:id'>>(true)
        assertType<MatchesPathPatternLax<'/books', '/books'>>(true)
    
        assertType<MatchesPathPatternLax<'/', '/:id'>>(false)
        assertType<MatchesPathPatternLax<'/123/', '/:id'>>(false)
        assertType<MatchesPathPatternLax<'/123/authors', '/:id'>>(false)
    });
    
    test('2 part path pattern', () => {
        assertType<MatchesPathPatternLax<'/books/123', '/books/:id'>>(true)
        assertType<MatchesPathPatternLax<'/books/abc', '/books/:id'>>(true)
        assertType<MatchesPathPatternLax<'/books/a', '/books/:id'>>(true)
    
        assertType<MatchesPathPatternLax<'/books', '/books/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/', '/books/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/', '/books/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors', '/books/:id'>>(false)

        const stringWithSlashes: string = `123/authors`;
        assertType<MatchesPathPatternLax<`/books/${typeof stringWithSlashes}`, '/books/:id'>>(true)
    })
    
    test('3 part path pattern', () => {
        assertType<MatchesPathPatternLax<`/books/${string}/authors`, '/books/:id/authors'>>(true)
        assertType<MatchesPathPatternLax<`/books/${string}`, '/books/:id/authors'>>(false)
    })
    
    test('4 part path pattern', () => {
        assertType<MatchesPathPatternLax<'/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456', '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/name', '/books/:id/authors/:id'>>(false)
    })
    
    test('5 part path pattern', () => {
        assertType<MatchesPathPatternLax<'/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/name', '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/name/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPatternLax<'/books/123/authors/456/name/last', '/books/:id/authors/:id/name'>>(false)

        const stringWithSlashes: string = 'a/b/c';
        assertType<MatchesPathPatternLax<`/books/${typeof stringWithSlashes}/authors/456/name`, '/books/:id/authors/:id/name'>>(true)
    })

    test('6 part path pattern', () => {
        assertType<MatchesPathPatternLax<`/a/b/c/d/e/f`, '/a/b/c/d/e/f'>>(true)
    });
})

describe('MatchesPathPattern', () => {
    test('1 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/books`, '/books'>>(true)
        assertType<MatchesPathPattern<`/123`, '/:id'>>(true)

        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/books'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/books'>>(true)
        assertType<MatchesPathPattern<`/b${string}`, '/books'>>(true)
        
        assertType<MatchesPathPattern<string, '/:id'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/:id'>>(true)
        assertType<MatchesPathPattern<`/1${string}`, '/:id'>>(true)

        // False cases
        assertType<MatchesPathPattern<'', '/books'>>(false)
        assertType<MatchesPathPattern<'/', '/books'>>(false)
        assertType<MatchesPathPattern<`/cat`, '/books'>>(false)
        assertType<MatchesPathPattern<`/a${string}`, '/books'>>(false)

        assertType<MatchesPathPattern<'', '/:id'>>(false)
        assertType<MatchesPathPattern<'/abc/def', '/:id'>>(false)

        // assertType<MatchesPathPattern<'/123', '/:id'>>(true)
        // assertType<MatchesPathPattern<'/books', '/books'>>(true)
    
        // assertType<MatchesPathPattern<'/', '/:id'>>(false)
        // assertType<MatchesPathPattern<'/123/', '/:id'>>(false)
        // assertType<MatchesPathPattern<'/123/authors', '/:id'>>(false)
    });
    
    test('2 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/books/123`, '/books/:id'>>(true)
        assertType<MatchesPathPattern<`/books/red`, '/books/red'>>(true)

        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/books/:id'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/books/:id'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/:id'>>(true)
        assertType<MatchesPathPattern<`/boo${string}/123`, '/books/:id'>>(true)
        // assertType<MatchesPathPattern2<`/boo${string}123`, '/books/:id'>>(true)

        assertType<MatchesPathPattern<string, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/books${string}ed`, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/books/${string}ed`, '/books/red'>>(true)
        assertType<MatchesPathPattern<`/books/r${string}ed`, '/books/red'>>(true)
        
        // False cases
        assertType<MatchesPathPattern<'', '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/`, '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/cat`, '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/books`, '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/books/123/name`, '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/books/${string}/name`, '/books/:id'>>(false)
        assertType<MatchesPathPattern<`/books/${number}`, '/books/:id/author'>>(false)
    })
    
    test('3 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/books/${string}/authors`, '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<`/books/123/authors`, '/books/:id/authors'>>(true)

        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<`/books/${string}`, '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<`/books/123${string}`, `/books/:id/authors`>>(true)
        assertType<MatchesPathPattern<`/bo${string}/123${string}`, `/books/:id/authors`>>(true)
        assertType<MatchesPathPattern<`${string}/books/${string}`, `/books/:id/authors`>>(true)
        assertType<MatchesPathPattern<`${string}books/${string}`, `/books/:id/authors`>>(true)
        assertType<MatchesPathPattern<`${string}/books/123${string}`, `/books/:id/authors`>>(true)

        // False cases
        assertType<MatchesPathPattern<`/cars`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<``, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/boo`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books/`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books/123`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books/123/`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books/123/a`, `/books/:id/authors`>>(false)
        assertType<MatchesPathPattern<`/books/${string}/cat`, `/books/:id/authors`>>(false)
    })
    
    test('4 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/a/b/c/d`, '/a/b/c/d'>>(true)
        assertType<MatchesPathPattern<`/books/${string}/authors/${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books/${string}/authors/123`, '/books/:id/authors/:id'>>(true)

        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books/${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books/a${string}`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books/a${string}/authors/a`, '/books/:id/authors/:id'>>(true)
        // assertType<MatchesPathPattern2<`/books/a${string}hors/a`, '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<`/books/a${string}/aut${string}hors/${string}`, '/books/:id/authors/:id'>>(true)

        // False cases
        assertType<MatchesPathPattern<'', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<`/`, '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<`/cars`, '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<`/books/123/authors/456/def`, '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<`/books/${string}/authors/456/def`, '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<`/books/${string}/authors/${string}/def`, '/books/:id/authors/:id'>>(false)
    })
    
    test('5 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/a/b/c/d/e`, '/a/b/c/d/e'>>(true)
        assertType<MatchesPathPattern<`/books/123/authors/456/name`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/${string}/authors/${string}/name`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/old/books/123/authors/456`, '/old/books/:id/authors/:id'>>(true)


        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/a/b/c/d/e'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/a/b/c/d/e'>>(true)
        assertType<MatchesPathPattern<`/boo${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1/${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1/a${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1/authors${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1/authors/2${string}`, '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/1/authors/2${string}/name`, '/books/:id/authors/:id/name'>>(true)

        // False cases
        assertType<MatchesPathPattern<'', '/a/b/c/d/e'>>(false)
        assertType<MatchesPathPattern<'/', '/a/b/c/d/e'>>(false)
        assertType<MatchesPathPattern<'/cat', '/a/b/c/d/e'>>(false)
        assertType<MatchesPathPattern<'/a/b/c/d/e/f', '/a/b/c/d/e'>>(false)
        assertType<MatchesPathPattern<`/boo${string}/def`, '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<`/boo${string}/def`, '/books/:id/authors/:id/name'>>(false)
    })

    test('6 part path pattern', () => {
        // Common truth cases
        assertType<MatchesPathPattern<`/a/b/c/d/e/f`, '/a/b/c/d/e/f'>>(true)
        assertType<MatchesPathPattern<`/old/books/123/authors/456/name`, '/old/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/old/books/${string}/authors/${string}/name`, '/old/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/old/books/123/authors/${string}/name`, '/old/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<`/books/123/authors/${string}/relatives/${string}`, '/books/:id/authors/:id/relatives/:id'>>(true)
        assertType<MatchesPathPattern<`/books/123/authors/123/relatives/456`, '/books/:id/authors/:id/relatives/:id'>>(true)

        // Uncommon truth cases
        assertType<MatchesPathPattern<string, '/a/b/c/d/e/f'>>(true)
        assertType<MatchesPathPattern<`/${string}`, '/a/b/c/d/e/f'>>(true)

        // False cases
        assertType<MatchesPathPattern<'', '/a/b/c/d/e/f'>>(false)
        assertType<MatchesPathPattern<'/', '/a/b/c/d/e/f'>>(false)
        assertType<MatchesPathPattern<`/cat`, '/a/b/c/d/e/f'>>(false)
        assertType<MatchesPathPattern<`/a/b/c/d/e/f/g`, '/a/b/c/d/e/f'>>(false)
        assertType<MatchesPathPattern<`/a/b/c/d/e/f/g`, '/a/b/c/d/e/:id'>>(false)
    });
})

describe('GetMatchingPathPattern', () => {
    test('works', () => {
        assertType<GetMatchingPathPattern<`/books/${string}`, '/books/:id' | '/books/:id/author'>>('' as '/books/:id' | '/books/:id/author')
    })
})

describe('GetMatchingPathPatternLax', () => {
    test('works', () => {
        assertType<GetMatchingPathPatternLax<`/books/${string}`, '/books/:id' | '/books/:id/author'>>('' as '/books/:id')
    })
})

describe('integration tests', () => {
    test('works', () => {
        type Contracts = {
            '/books/:id/author': {
                name: string,
            },
            '/books/:id': {
                author: { name: string },
            },
            '/cars/:id': {
                color: string,
            }
        }
    
        function publish<TPath extends PathPatternToTemplateLiteral<keyof Contracts>, TMatchedPathPattern extends GetMatchingPathPatternLax<TPath, keyof Contracts>>(path: NoExtraPathSegments<TPath, keyof Contracts>, event: Contracts[TMatchedPathPattern]) {
        
        }

        publish('/books/12', {
            author: {
                name: 'John Doe'
            }
        })

        publish('/cars/123', {
            color: 'Red'
        })

        publish(
            // @ts-expect-error -- Extra path segment
            '/books/456/extra-path-segment', 
            {

            }
        )

        publish(
            // @ts-expect-error -- Extra path segment
            '/non-existent-path', 
            {}
        )

        function subscribe<TPath extends PathPatternToTemplateLiteral<keyof Contracts>>(path: NoExtraPathSegments<TPath, keyof Contracts>, callback: (event: Contracts[GetMatchingPathPattern<TPath, keyof Contracts>]) => void) {

        }

        subscribe('/books/123', (event) => {
            assertType<typeof event>({ author: { name: 'string' } });
        });

        subscribe('/books/123/author', (event) => {
            assertType<typeof event>({ name: 'string' });
        });

        const myId: string = '' as '123' | '123/author';
        subscribe(`/books/${myId}`, (event) => {
            // `event` may be either `{ author: string }` or `{ name: string }`,
            // because we don't know if `myId` is `123` or `123/author`
            assertType<typeof event>({} as { author: { name: string} } | { name: string });
        });

        subscribe('/cars/123', (event) => {
            assertType<typeof event>({ color: 'string' });
        });

        subscribe(
            // @ts-expect-error -- Non-existent path
            '/non-existent-path', 
            (event) => {}
        );

        subscribe(
            // @ts-expect-error -- Extra path segment
            '/books/123/extra-path-segment', 
            (event) => {}
        );
    })
})


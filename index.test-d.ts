import { describe, test, assertType } from 'vitest'
import type { MatchesPathPattern, GetMatchingPathPattern, PathPatternToTemplateLiteral, NoExtraPathSegments } from './index.ts'

describe('MatchesPathPattern', () => {
    test('1 part path pattern', () => {
        assertType<MatchesPathPattern<'/123', '/:id'>>(true)
        assertType<MatchesPathPattern<'/books', '/books'>>(true)
    
        assertType<MatchesPathPattern<'/', '/:id'>>(false)
        assertType<MatchesPathPattern<'/123/', '/:id'>>(false)
        assertType<MatchesPathPattern<'/123/authors', '/:id'>>(false)
    });
    
    test('2 part path pattern', () => {
        assertType<MatchesPathPattern<'/books/123', '/books/:id'>>(true)
        assertType<MatchesPathPattern<'/books/abc', '/books/:id'>>(true)
        assertType<MatchesPathPattern<'/books/a', '/books/:id'>>(true)
    
        assertType<MatchesPathPattern<'/books', '/books/:id'>>(false)
        assertType<MatchesPathPattern<'/books/', '/books/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/', '/books/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors', '/books/:id'>>(false)
    })
    
    test('3 part path pattern', () => {
        assertType<MatchesPathPattern<'/books', '/books/:id/authors'>>(false)
        assertType<MatchesPathPattern<'/books/', '/books/:id/authors'>>(false)
        assertType<MatchesPathPattern<'/books/123/', '/books/:id/authors'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors', '/books/:id/authors'>>(true)
        assertType<MatchesPathPattern<'/books/123/authors/', '/books/:id/authors'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/comments', '/books/:id/authors'>>(false)
    })
    
    test('4 part path pattern', () => {
        assertType<MatchesPathPattern<'/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456', '/books/:id/authors/:id'>>(true)
        assertType<MatchesPathPattern<'/books/123/authors/456/', '/books/:id/authors/:id'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456/name', '/books/:id/authors/:id'>>(false)
    })
    
    test('5 part path pattern', () => {
        assertType<MatchesPathPattern<'/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456/name', '/books/:id/authors/:id/name'>>(true)
        assertType<MatchesPathPattern<'/books/123/authors/456/name/', '/books/:id/authors/:id/name'>>(false)
        assertType<MatchesPathPattern<'/books/123/authors/456/name/last', '/books/:id/authors/:id/name'>>(false)
    })
})

describe('GetMatchingPathPattern', () => {
    test('works', () => {
        assertType<GetMatchingPathPattern<'/cars/123', '/books/:id' | '/cars/:id'>>('/cars/:id')
        assertType<GetMatchingPathPattern<'/cars/123/wheels', '/cars/:id' | '/cars/:id/wheels'>>('/cars/:id/wheels')
    })
})

describe('integration tests', () => {
    test('works', () => {
        type Contracts = {
            '/books/:id/author': {
                name: string,
            },
            '/books/:id': {
                author: string,
            },
            '/cars/:id': {
                color: string,
            }
        }
    
        function publish<TPath extends PathPatternToTemplateLiteral<keyof Contracts>, TMatchedPathPattern extends GetMatchingPathPattern<TPath, keyof Contracts>>(path: NoExtraPathSegments<TPath, keyof Contracts>, event: Contracts[TMatchedPathPattern]) {
        
        }

        publish('/books/456', {
            author: 'John Doe'
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
            assertType<typeof event>({ author: 'string' });
        });

        subscribe('/books/123/author', (event) => {
            assertType<typeof event>({ name: 'string' });
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


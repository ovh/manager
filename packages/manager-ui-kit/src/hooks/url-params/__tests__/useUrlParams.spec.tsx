import type { ReactNode } from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useUrlParams } from '../useUrlParams';

const createWrapper =
  (initialEntries: string[]) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

describe('useUrlParams', () => {
  it('parses params and removes empty values', () => {
    const { result } = renderHook(
      () => useUrlParams(['foo', 'single', 'empty', 'missing'] as const),
      {
        wrapper: createWrapper(['/test?foo=bar&foo=baz&empty=&single=one']),
      },
    );

    expect(result.current.params.foo).toEqual(['bar', 'baz']);
    expect(result.current.params.single).toBe('one');
    expect(result.current.params.empty).toBeUndefined();
    expect(result.current.params.missing).toBeUndefined();

    return waitFor(() => {
      expect(result.current.searchParams.has('empty')).toBe(false);
      expect(result.current.queryString).toBe('foo=bar&foo=baz&single=one');
    });
  });

  it('updates a single query param and deletes on empty', () => {
    const { result } = renderHook(() => useUrlParams(['foo'] as const), {
      wrapper: createWrapper(['/test?foo=bar']),
    });

    act(() => {
      result.current.setQueryParam('foo', 'baz');
    });

    return waitFor(() => {
      expect(result.current.searchParams.get('foo')).toBe('baz');
      expect(result.current.queryString).toBe('foo=baz');
    }).then(() => {
      act(() => {
        result.current.setQueryParam('foo', '');
      });

      return waitFor(() => {
        expect(result.current.searchParams.has('foo')).toBe(false);
        expect(result.current.queryString).toBe('');
      });
    });
  });

  it('updates multiple params and cleans array values', () => {
    const { result } = renderHook(() => useUrlParams(['foo', 'bar'] as const), {
      wrapper: createWrapper(['/test?foo=bar&bar=baz']),
    });

    act(() => {
      result.current.setQueryParams({ foo: ['a', '', 'b'], bar: '' });
    });

    return waitFor(() => {
      expect(result.current.searchParams.getAll('foo')).toEqual(['a', 'b']);
      expect(result.current.searchParams.has('bar')).toBe(false);
      expect(result.current.queryString).toBe('foo=a&foo=b');
    });
  });

  it('clears only managed keys', () => {
    const { result } = renderHook(() => useUrlParams(['foo', 'bar'] as const), {
      wrapper: createWrapper(['/test?foo=bar&bar=baz&keep=yes']),
    });

    act(() => {
      result.current.clearKeys();
    });

    return waitFor(() => {
      expect(result.current.searchParams.has('foo')).toBe(false);
      expect(result.current.searchParams.has('bar')).toBe(false);
      expect(result.current.searchParams.get('keep')).toBe('yes');
      expect(result.current.queryString).toBe('keep=yes');
    });
  });
});

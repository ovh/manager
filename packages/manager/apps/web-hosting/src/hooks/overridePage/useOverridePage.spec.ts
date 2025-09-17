import * as reactRouterDom from 'react-router-dom';

import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RouteMatch } from '@/routes/routes';

import { useOverridePage } from './useOverridePage';

const makeMatch = (isOverridePage?: boolean): RouteMatch =>
  ({
    handle: { isOverridePage },
  }) as RouteMatch;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useOverridePage', () => {
  it('should return false when there are no matches', () => {
    vi.spyOn(reactRouterDom, 'useMatches').mockReturnValue([] as RouteMatch[]);

    const { result } = renderHook(() => useOverridePage());

    expect(result.current).toBe(false);
  });

  it('should return false when no match has isOverridePage set to true', () => {
    vi.spyOn(reactRouterDom, 'useMatches').mockReturnValue([makeMatch(false)]);

    const { result } = renderHook(() => useOverridePage());

    expect(result.current).toBe(false);
  });

  it('should return true when at least one match has isOverridePage set to true', () => {
    vi.spyOn(reactRouterDom, 'useMatches').mockReturnValue([makeMatch(true)]);

    const { result } = renderHook(() => useOverridePage());

    expect(result.current).toBe(true);
  });

  it('should return true when one of multiple matches has isOverridePage set to true', () => {
    vi.spyOn(reactRouterDom, 'useMatches').mockReturnValue([makeMatch(false), makeMatch(true)]);

    const { result } = renderHook(() => useOverridePage());

    expect(result.current).toBe(true);
  });
});

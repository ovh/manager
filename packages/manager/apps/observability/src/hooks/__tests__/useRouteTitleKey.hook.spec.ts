import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRouteTitleKey } from '@/hooks/useRouteTitleKey.hook';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useMatches: vi.fn(() => []),
  };
});

const mockUseMatches = vi.mocked((await import('react-router-dom')).useMatches) as ReturnType<
  typeof vi.fn
>;

type MockMatch = { id: string; pathname: string; handle?: { titleKey?: string } };

describe('useRouteTitleKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMatches.mockReturnValue([]);
  });

  it('should return undefined when no route match has titleKey', () => {
    mockUseMatches.mockReturnValue([
      { id: 'root', pathname: '/', handle: {} },
      { id: 'tenant', pathname: '/tenant/123', handle: {} },
    ] as MockMatch[]);

    const { result } = renderHook(() => useRouteTitleKey());

    expect(result.current).toBeUndefined();
  });

  it('should return undefined when matches array is empty', () => {
    mockUseMatches.mockReturnValue([]);

    const { result } = renderHook(() => useRouteTitleKey());

    expect(result.current).toBeUndefined();
  });

  it('should return titleKey from the first matching route that has titleKey', () => {
    mockUseMatches.mockReturnValue([
      { id: 'root', pathname: '/', handle: {} },
      {
        id: 'tenant-creation',
        pathname: '/tenant/creation',
        handle: { titleKey: 'creation.title' },
      },
    ] as MockMatch[]);

    const { result } = renderHook(() => useRouteTitleKey());

    expect(result.current).toBe('creation.title');
  });

  it('should return titleKey from nested route when parent has no titleKey', () => {
    mockUseMatches.mockReturnValue([
      { id: 'root', pathname: '/', handle: {} },
      { id: 'tenant', pathname: '/tenant/123', handle: {} },
      {
        id: 'tenant-edit',
        pathname: '/tenant/123/edit',
        handle: { titleKey: 'edition.title' },
      },
    ] as MockMatch[]);

    const { result } = renderHook(() => useRouteTitleKey());

    expect(result.current).toBe('edition.title');
  });

  it('should return the first titleKey when multiple matches have titleKey', () => {
    mockUseMatches.mockReturnValue([
      { id: 'root', pathname: '/', handle: { titleKey: 'root.title' } },
      {
        id: 'tenant-creation',
        pathname: '/tenant/creation',
        handle: { titleKey: 'creation.title' },
      },
    ] as MockMatch[]);

    const { result } = renderHook(() => useRouteTitleKey());

    expect(result.current).toBe('root.title');
  });
});

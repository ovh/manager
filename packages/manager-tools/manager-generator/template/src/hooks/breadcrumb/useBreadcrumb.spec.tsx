import { useHref, useLocation } from 'react-router-dom';

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockedFunction } from 'vitest';

import { formatToTitleCase } from '@/utils/String.utils';

import { useBreadcrumb } from './useBreadcrumb';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------
vi.mock('react-router-dom', () => ({
  useHref: vi.fn(),
  useLocation: vi.fn(),
}));

const mockedUseHref = useHref as MockedFunction<typeof useHref>;
const mockedUseLocation = useLocation as MockedFunction<typeof useLocation>;

describe('useBreadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseHref.mockReturnValue('/app-mock'); // default root
    mockedUseLocation.mockReturnValue({ pathname: '/' } as ReturnType<typeof useLocation>);
  });

  it('returns root breadcrumb only when pathname is "/"', () => {
    mockedUseLocation.mockReturnValue({ pathname: '/' } as ReturnType<typeof useLocation>);

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'App Mock' }));

    expect(result.current).toEqual([{ id: 'root', label: 'App Mock', href: '/app-mock' }]);
  });

  it('builds breadcrumbs for nested path without item overrides', () => {
    mockedUseLocation.mockReturnValue({
      pathname: '/projects/123/details',
    } as ReturnType<typeof useLocation>);

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'App Mock' }));

    expect(result.current).toEqual([
      { id: 'root', label: 'App Mock', href: '/app-mock' },
      { id: 'projects', label: formatToTitleCase('projects'), href: '/app-mock/projects' },
      { id: '123', label: '123', href: '/app-mock/projects/123' },
      {
        id: 'details',
        label: formatToTitleCase('details'),
        href: '/app-mock/projects/123/details',
      },
    ]);
  });

  it('uses item overrides when provided', () => {
    mockedUseLocation.mockReturnValue({
      pathname: '/projects/123/details',
    } as ReturnType<typeof useLocation>);

    const items = [
      { id: 'projects', label: 'Projects' },
      { id: 'details', label: 'Details' },
    ];

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'App Mock', items }));

    expect(result.current).toEqual([
      { id: 'root', label: 'App Mock', href: '/app-mock' },
      { id: 'projects', label: 'Projects', href: '/app-mock/projects' },
      { id: '123', label: '123', href: '/app-mock/projects/123' },
      { id: 'details', label: 'Details', href: '/app-mock/projects/123/details' },
    ]);
  });

  it('trims trailing slashes from root href', () => {
    mockedUseHref.mockReturnValue('/app-mock///');
    mockedUseLocation.mockReturnValue({ pathname: '/foo' } as ReturnType<typeof useLocation>);

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'App Mock' }));

    expect(result.current[0]).toEqual({
      id: 'root',
      label: 'App Mock',
      href: '/app-mock', // trimmed
    });
  });
});

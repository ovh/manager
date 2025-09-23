import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createMockNavigation, createMockShell, createWrapper } from '@/utils/Test.utils';

import { useBreadcrumb } from './useBreadcrumb';

describe('useBreadcrumb', () => {
  it('returns root + path breadcrumbs when navigation works', async () => {
    const mockShell = createMockShell({
      navigation: createMockNavigation({
        getURL: vi.fn().mockResolvedValue('/base-url'),
      }),
    });

    const wrapper = createWrapper({ shell: mockShell, route: '/foo/bar' });

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'Dashboard', appName: 'app' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual([
        { label: 'Dashboard', href: '/base-url' },
        { label: 'foo', hideLabel: false, href: '#/vaults/foo' },
        { label: 'bar', hideLabel: false, href: '#/vaults/foo/bar' },
      ]);
    });
  });

  it('returns only path breadcrumbs if getURL rejects', async () => {
    const mockShell = createMockShell({
      navigation: createMockNavigation({
        getURL: vi.fn().mockRejectedValue(new Error('boom')),
      }),
    });

    const wrapper = createWrapper({ shell: mockShell, route: '/alpha/beta' });

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'Root', appName: 'app' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual([
        { label: 'alpha', hideLabel: false, href: '#/vaults/alpha' },
        { label: 'beta', hideLabel: false, href: '#/vaults/alpha/beta' },
      ]);
    });
  });

  it('returns only root breadcrumb when no path segments', async () => {
    const mockShell = createMockShell({
      navigation: createMockNavigation({
        getURL: vi.fn().mockResolvedValue('/base-url'),
      }),
    });

    const wrapper = createWrapper({ shell: mockShell, route: '/' });

    const { result } = renderHook(() => useBreadcrumb({ rootLabel: 'Home', appName: 'app' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current).toEqual([{ label: 'Home', href: '/base-url' }]);
    });
  });
});

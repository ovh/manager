import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { BreadcrumbProps } from '@/types/Breadcrumb.type';
import { RouterWrapper } from '@/utils/Test.utils';

import { useBreadcrumb } from './useBreadcrumb';

vi.mock('@/routes/Routes.constant', () => ({
  urls: { root: '/' },
}));

vi.mock('@/utils/String.utils', () => ({
  formatToTitleCase: (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

type Item = { id: string; label?: string; href: string };

describe('useBreadcrumb', () => {
  it('returns only the root item on "/"', () => {
    const wrapper = RouterWrapper('/');
    const props: BreadcrumbProps = { rootLabel: 'Home' };

    const { result } = renderHook(() => useBreadcrumb(props), { wrapper });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual<Item>({
      id: 'root',
      label: 'Home',
      href: '',
    });
  });

  it('builds a breadcrumb trail for a nested path and uses provided labels', () => {
    const wrapper = RouterWrapper('/projects/alpha');
    const props: BreadcrumbProps = {
      rootLabel: 'Home',
      items: [{ id: 'projects', label: 'Projects' }],
    };

    const { result } = renderHook(() => useBreadcrumb(props), { wrapper });

    expect(result.current).toHaveLength(3);

    const root = result.current[0] as Item;
    const projects = result.current[1]! as Item;
    const alpha = result.current[2]! as Item;

    expect(root).toEqual<Item>({ id: 'root', label: 'Home', href: '' });

    expect(projects.id).toBe('projects');
    expect(projects.label).toBe('Projects');
    expect(projects.href).toBe('/projects');

    expect(alpha.id).toBe('alpha');
    expect(alpha.label).toBe('Alpha');
    expect(alpha.href).toBe('/projects/alpha');
  });

  it('handles deeper paths and keeps accumulating hrefs', () => {
    const wrapper = RouterWrapper('/org/123/services/zimbra');
    const props: BreadcrumbProps = {
      rootLabel: 'Root',
      items: [
        { id: 'org', label: 'Organization' },
        { id: 'services', label: 'Services' },
      ],
    };

    const { result } = renderHook(() => useBreadcrumb(props), { wrapper });

    const items = result.current as readonly Item[];

    expect(items.map((i) => i.href)).toEqual([
      '',
      '/org',
      '/org/123',
      '/org/123/services',
      '/org/123/services/zimbra',
    ]);

    expect(items.map((i) => i.label)).toEqual([
      'Root',
      'Organization',
      '123',
      'Services',
      'Zimbra',
    ]);
  });
});

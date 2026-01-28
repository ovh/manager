import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { useObsBreadcrumb } from '@/hooks/breadcrumb/useObsBreadcrumb.hook';
import { BreadcrumbConfig } from '@/types/breadcrumb/Breadcrumb.types';

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: {
      navigation: {
        getURL: () => Promise.resolve('https://www.ovh.com/manager/#/'),
      },
    },
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'breadcrumb:metrics': 'Metrics',
        'breadcrumb:tenants': 'Tenants',
        'breadcrumb:creation': 'Creation',
        'breadcrumb:edit': 'Edit',
        'breadcrumb:subscription': 'Subscription',
        'breadcrumb:root_aria_label': 'Home',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/routes/Routes.base', () => ({
  getRoot: () => '',
}));

const createWrapper =
  (initialEntries: string[] = ['/']) =>
  ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );

const testConfig: BreadcrumbConfig = {
  root: {
    icon: ICON_NAME.home,
    ariaLabel: 'breadcrumb:root_aria_label',
    path: '/',
  },
  routes: [
    // Static segment before dynamic to test ordering
    {
      pattern: '/metrics/tenants/:resourceName/creation',
      items: [
        { labelKey: 'breadcrumb:metrics', path: '/metrics' },
        { labelKey: 'breadcrumb:tenants', path: '/metrics/tenants' },
        { labelKey: 'breadcrumb:creation' },
      ],
    },
    {
      pattern: '/metrics/tenants/:resourceName/:tenantId/edit',
      items: [
        { labelKey: 'breadcrumb:metrics', path: '/metrics' },
        { labelKey: 'breadcrumb:tenants', path: '/metrics/tenants' },
        { path: '/metrics/tenants/:resourceName/:tenantId' },
        { labelKey: 'breadcrumb:edit' },
      ],
    },
    {
      pattern: '/metrics/tenants/:resourceName/:tenantId',
      items: [
        { labelKey: 'breadcrumb:metrics', path: '/metrics' },
        { labelKey: 'breadcrumb:tenants', path: '/metrics/tenants' },
        { path: '/metrics/tenants/:resourceName/:tenantId' },
      ],
    },
    {
      pattern: '/metrics/tenants',
      items: [
        { labelKey: 'breadcrumb:metrics', path: '/metrics' },
        { labelKey: 'breadcrumb:tenants' },
      ],
    },
    {
      pattern: '/metrics',
      items: [{ labelKey: 'breadcrumb:metrics' }],
    },
  ],
  fallbackToPathBased: true,
};

describe('useObsBreadcrumb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('route matching', () => {
    it('should match simple route pattern', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics']),
      });

      expect(result.current).toHaveLength(2); // root + metrics
      expect(result.current[1]?.label).toBe('Metrics');
    });

    it('should match nested route pattern', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants']),
      });

      expect(result.current).toHaveLength(3); // root + metrics + tenants
      expect(result.current[1]?.label).toBe('Metrics');
      expect(result.current[2]?.label).toBe('Tenants');
    });

    it('should match route with dynamic parameters', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants/my-resource/my-tenant-id']),
      });

      expect(result.current).toHaveLength(4); // root + metrics + tenants + tenant
      expect(result.current[3]?.label).toBe('my-tenant-id'); // segment fallback
    });

    it('should prefer static segment over dynamic when same depth', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants/my-resource/creation']),
      });

      expect(result.current).toHaveLength(4); // root + metrics + tenants + creation
      expect(result.current[3]?.label).toBe('Creation'); // Not 'creation' as tenant ID
    });
  });

  describe('root item', () => {
    it('should include root item with icon', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics']),
      });

      const rootItem = result.current[0];
      expect(rootItem?.key).toBe('root');
      expect(rootItem?.icon).toBe(ICON_NAME.home);
      expect(rootItem?.label).toBeUndefined(); // No label when icon is set
    });

    it('should translate root aria label', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics']),
      });

      const rootItem = result.current[0];
      expect(rootItem?.ariaLabel).toBe('Home');
    });

    it('should fetch root href from shell navigation', async () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics']),
      });

      await waitFor(() => {
        const rootItem = result.current[0];
        expect(rootItem?.href).toBe('https://www.ovh.com/manager/#/');
      });
    });
  });

  describe('translations', () => {
    it('should translate label keys', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants']),
      });

      expect(result.current[1]?.label).toBe('Metrics');
      expect(result.current[2]?.label).toBe('Tenants');
    });
  });

  describe('segment fallback label', () => {
    it('should use URL segment as label when no label/labelKey configured', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants/resource-123/tenant-456']),
      });

      const tenantItem = result.current[3];
      expect(tenantItem?.label).toBe('tenant-456');
    });
  });

  describe('link generation', () => {
    it('should generate correct to for items with paths', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants']),
      });

      expect(result.current[1]?.to).toBe('/metrics');
      expect(result.current[2]?.to).toBe(''); // Last item has no path
    });

    it('should replace dynamic parameters in to', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants/my-resource/my-tenant/edit']),
      });

      const tenantItem = result.current[3];
      expect(tenantItem?.to).toBe('/metrics/tenants/my-resource/my-tenant');
    });
  });

  describe('isLast flag', () => {
    it('should mark last visible item as isLast', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/metrics/tenants']),
      });

      expect(result.current[0]?.isLast).toBe(false);
      expect(result.current[1]?.isLast).toBe(false);
      expect(result.current[2]?.isLast).toBe(true);
    });
  });

  describe('hidden items', () => {
    it('should include hidden items but mark them', () => {
      const configWithHidden: BreadcrumbConfig = {
        root: { icon: ICON_NAME.home, path: '/' },
        routes: [
          {
            pattern: '/test',
            items: [
              { labelKey: 'visible', path: '/visible' },
              { labelKey: 'hidden', hidden: true },
            ],
          },
        ],
        fallbackToPathBased: false,
      };

      const { result } = renderHook(() => useObsBreadcrumb({ config: configWithHidden }), {
        wrapper: createWrapper(['/test']),
      });

      const hiddenItem = result.current.find((item) => item.hidden);
      expect(hiddenItem).toBeDefined();
      expect(hiddenItem?.hidden).toBe(true);
    });

    it('should mark last visible item as isLast even with hidden items after', () => {
      const configWithHidden: BreadcrumbConfig = {
        root: { icon: ICON_NAME.home, path: '/' },
        routes: [
          {
            pattern: '/test',
            items: [{ labelKey: 'visible' }, { labelKey: 'hidden', hidden: true }],
          },
        ],
        fallbackToPathBased: false,
      };

      const { result } = renderHook(() => useObsBreadcrumb({ config: configWithHidden }), {
        wrapper: createWrapper(['/test']),
      });

      const visibleItems = result.current.filter((item) => !item.hidden);
      const lastVisible = visibleItems[visibleItems.length - 1];
      expect(lastVisible?.isLast).toBe(true);
    });
  });

  describe('fallback behavior', () => {
    it('should fallback to path-based items when no route matches', () => {
      const { result } = renderHook(() => useObsBreadcrumb({ config: testConfig }), {
        wrapper: createWrapper(['/unknown/path/here']),
      });

      // Root + 3 path segments
      expect(result.current).toHaveLength(4);
      expect(result.current[1]?.label).toBe('unknown');
      expect(result.current[2]?.label).toBe('path');
      expect(result.current[3]?.label).toBe('here');
    });

    it('should not fallback when fallbackToPathBased is false', () => {
      const configNoFallback: BreadcrumbConfig = {
        root: { icon: ICON_NAME.home, path: '/' },
        routes: [],
        fallbackToPathBased: false,
      };

      const { result } = renderHook(() => useObsBreadcrumb({ config: configNoFallback }), {
        wrapper: createWrapper(['/unknown/path']),
      });

      // Only root item
      expect(result.current).toHaveLength(1);
    });
  });
});

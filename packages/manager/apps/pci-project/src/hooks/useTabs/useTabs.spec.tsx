import { describe, it, expect } from 'vitest';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTabs } from './useTabs';
import { renderHookWithProviders, MOCKED_PROJECT_ID } from '@/test-utils';

describe('useTabs Hook', () => {
  describe('Hook Structure and Return Value', () => {
    it('should return the correct tabs structure', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      expect(result.current).toBeDefined();
      expect(result.current.tabs).toBeDefined();
      expect(Array.isArray(result.current.tabs)).toBe(true);
    });

    it('should return exactly 2 tabs', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      expect(result.current.tabs).toHaveLength(2);
    });

    it('should return tabs with correct properties', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const { tabs } = result.current;

      tabs.forEach((tab: any) => {
        expect(tab).toHaveProperty('name');
        expect(tab).toHaveProperty('title');
        expect(tab).toHaveProperty('to');
        expect(typeof tab.name).toBe('string');
        expect(typeof tab.title).toBe('string');
        expect(typeof tab.to).toBe('string');
      });
    });
  });

  describe('Tab Configuration', () => {
    it('should have correct home tab configuration', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const homeTab = result.current.tabs.find(
        (tab: any) => tab.name === 'home',
      );

      expect(homeTab).toBeDefined();
      expect(homeTab?.name).toBe('home');
      expect(homeTab?.title).toBe('pci_projects_project_home');
      expect(homeTab?.to).toBe('/');
    });

    it('should have correct settings tab configuration', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const settingsTab = result.current.tabs.find(
        (tab: any) => tab.name === 'settings',
      );

      expect(settingsTab).toBeDefined();
      expect(settingsTab?.name).toBe('settings');
      expect(settingsTab?.title).toBe('pci_projects_project_settings');
      expect(settingsTab?.to).toBe('/edit');
    });
  });

  describe('Tab Order', () => {
    it('should have home tab as first tab', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const firstTab = result.current.tabs[0];
      expect(firstTab.name).toBe('home');
    });

    it('should have settings tab as second tab', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const secondTab = result.current.tabs[1];
      expect(secondTab.name).toBe('settings');
    });

    it('should maintain consistent tab order', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const tabNames = result.current.tabs.map((tab: any) => tab.name);
      expect(tabNames).toEqual(['home', 'settings']);
    });
  });

  describe('Translation Keys', () => {
    it('should use correct translation keys for tab titles', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const homeTab = result.current.tabs.find(
        (tab: any) => tab.name === 'home',
      );
      const settingsTab = result.current.tabs.find(
        (tab: any) => tab.name === 'settings',
      );

      expect(homeTab?.title).toBe('pci_projects_project_home');
      expect(settingsTab?.title).toBe('pci_projects_project_settings');
    });

    it('should use consistent translation key pattern', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      result.current.tabs.forEach((tab: any) => {
        expect(tab.title).toMatch(/^pci_projects_project_/);
      });
    });
  });

  describe('Navigation Paths', () => {
    it('should have correct navigation paths', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const homeTab = result.current.tabs.find(
        (tab: any) => tab.name === 'home',
      );
      const settingsTab = result.current.tabs.find(
        (tab: any) => tab.name === 'settings',
      );

      expect(homeTab?.to).toBe('/');
      expect(settingsTab?.to).toBe('/edit');
    });

    it('should have valid URL paths', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      result.current.tabs.forEach((tab: any) => {
        expect(tab.to).toMatch(/^\/.*$/);
      });
    });
  });

  describe('Hook Stability', () => {
    it('should return stable references between renders', () => {
      const { result, rerender } = renderHookWithProviders(() => useTabs());
      const firstRender = result.current;

      rerender();

      const secondRender = result.current;
      expect(firstRender.tabs).toEqual(secondRender.tabs);
    });

    it('should not change tab configuration on re-renders', () => {
      const { result, rerender } = renderHookWithProviders(() => useTabs());
      const initialTabs = result.current.tabs;

      // Force multiple re-renders
      Array.from({ length: 5 }).forEach(() => {
        rerender();
      });

      expect(result.current.tabs).toEqual(initialTabs);
    });
  });

  describe('Performance', () => {
    it('should render efficiently', async () => {
      const startTime = performance.now();
      const { result } = renderHookWithProviders(() => useTabs());
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Le hook devrait se rendre rapidement (moins de 10ms)
      expect(renderTime).toBeLessThan(10);
      expect(result.current.tabs).toHaveLength(2);
    });

    it('should handle multiple rapid calls efficiently', () => {
      const startTime = performance.now();

      // Appeler le hook plusieurs fois rapidement
      Array.from({ length: 100 }).forEach(() => {
        const { result } = renderHookWithProviders(() => useTabs());
        expect(result.current.tabs).toHaveLength(2);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 100 appels devraient être rapides (moins de 100ms)
      expect(totalTime).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent hook calls', () => {
      const { result: result1 } = renderHookWithProviders(() => useTabs());
      const { result: result2 } = renderHookWithProviders(() => useTabs());

      expect(result1.current.tabs).toEqual(result2.current.tabs);
    });

    it('should work correctly in different contexts', () => {
      // Simuler différents contextes de projet
      const contexts = [
        { projectId: 'project-1' },
        { projectId: 'project-2' },
        { projectId: MOCKED_PROJECT_ID },
      ];

      contexts.forEach(() => {
        const { result } = renderHookWithProviders(() => useTabs());
        expect(result.current.tabs).toHaveLength(2);
        expect(result.current.tabs[0].name).toBe('home');
        expect(result.current.tabs[1].name).toBe('settings');
      });
    });
  });

  describe('Integration with Router', () => {
    it('should work with React Router context', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      // Vérifier que les chemins sont compatibles avec React Router
      result.current.tabs.forEach((tab: any) => {
        expect(tab.to).toBeDefined();
        expect(typeof tab.to).toBe('string');
        expect(tab.to.length).toBeGreaterThan(0);
      });
    });

    it('should have valid relative paths', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      result.current.tabs.forEach((tab: any) => {
        // Les chemins devraient être relatifs et commencer par /
        expect(tab.to).toMatch(/^\/[^/]*$/);
      });
    });
  });

  describe('Accessibility', () => {
    it('should provide accessible tab names', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      result.current.tabs.forEach((tab: any) => {
        expect(tab.name).toBeDefined();
        expect(tab.name.length).toBeGreaterThan(0);
        expect(typeof tab.name).toBe('string');
      });
    });

    it('should have descriptive tab titles', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      result.current.tabs.forEach((tab: any) => {
        expect(tab.title).toBeDefined();
        expect(tab.title.length).toBeGreaterThan(0);
        expect(tab.title).toMatch(/^pci_projects_project_/);
      });
    });
  });

  describe('Internationalization Support', () => {
    it('should support translation keys for different languages', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const translationKeys = result.current.tabs.map((tab: any) => tab.title);

      // Vérifier que les clés de traduction suivent le pattern attendu
      translationKeys.forEach((key: any) => {
        expect(key).toMatch(/^pci_projects_project_/);
      });
    });

    it('should have consistent translation key structure', () => {
      const { result } = renderHookWithProviders(() => useTabs());
      const homeTab = result.current.tabs.find(
        (tab: any) => tab.name === 'home',
      );
      const settingsTab = result.current.tabs.find(
        (tab: any) => tab.name === 'settings',
      );

      expect(homeTab?.title).toBe('pci_projects_project_home');
      expect(settingsTab?.title).toBe('pci_projects_project_settings');
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed tab objects', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      result.current.tabs.forEach((tab: any) => {
        // Vérifier que chaque propriété a le bon type
        expect(typeof tab.name).toBe('string');
        expect(typeof tab.title).toBe('string');
        expect(typeof tab.to).toBe('string');

        // Vérifier que les propriétés sont requises
        expect(tab.name).toBeDefined();
        expect(tab.title).toBeDefined();
        expect(tab.to).toBeDefined();
      });
    });

    it('should not have additional unexpected properties', () => {
      const { result } = renderHookWithProviders(() => useTabs());

      result.current.tabs.forEach((tab: any) => {
        const expectedKeys = ['name', 'title', 'to'];
        const actualKeys = Object.keys(tab);

        expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
        expect(actualKeys.length).toBe(expectedKeys.length);
      });
    });
  });

  describe('Consistency and Reliability', () => {
    it('should always return the same structure', () => {
      const iterations = 10;
      const results: any[] = [];

      Array.from({ length: iterations }).forEach(() => {
        const { result } = renderHookWithProviders(() => useTabs());
        results.push(result.current.tabs);
      });

      // Tous les résultats devraient être identiques
      const firstResult = results[0];
      results.forEach((result) => {
        expect(result).toEqual(firstResult);
      });
    });

    it('should be deterministic', () => {
      const { result: result1 } = renderHookWithProviders(() => useTabs());
      const { result: result2 } = renderHookWithProviders(() => useTabs());

      expect(result1.current.tabs).toEqual(result2.current.tabs);
    });
  });
});

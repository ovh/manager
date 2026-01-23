import { describe, expect, it } from 'vitest';

import { TabNavigationItem } from '@/components/dashboard/tab-navigation/TabNavigationItem.type';
import { getActiveTab, getTabByName } from '@/utils/tab-navigation.utils';

describe('tab-navigation.utils', () => {
  const mockTabs: TabNavigationItem[] = [
    {
      name: 'general-information',
      title: 'General Information',
      url: '',
    },
    {
      name: 'subscription',
      title: 'Subscription',
      url: 'subscription',
    },
    {
      name: 'tags',
      title: 'Tags',
      url: 'tags',
    },
  ];

  describe('getActiveTab', () => {
    it('should return empty string when tabs array is empty', () => {
      expect(getActiveTab([], '/some/path')).toBe('');
    });

    it('should return empty string when tabs is null or undefined', () => {
      expect(getActiveTab(null as unknown as TabNavigationItem[], '/some/path')).toBe('');
      expect(getActiveTab(undefined as unknown as TabNavigationItem[], '/some/path')).toBe('');
    });

    it('should return first tab name when currentPath is empty', () => {
      expect(getActiveTab(mockTabs, '')).toBe('general-information');
      expect(getActiveTab(mockTabs, '/')).toBe('general-information');
    });

    it('should return first tab name when no tab matches the path', () => {
      expect(getActiveTab(mockTabs, '/unknown/path')).toBe('general-information');
      expect(getActiveTab(mockTabs, '/dashboard/settings')).toBe('general-information');
    });

    it('should return matching tab name when path segment matches a tab url', () => {
      expect(getActiveTab(mockTabs, '/subscription')).toBe('subscription');
      expect(getActiveTab(mockTabs, '/tags')).toBe('tags');
    });

    it('should return matching tab name when path has multiple segments and first matches', () => {
      expect(getActiveTab(mockTabs, '/subscription/details')).toBe('subscription');
      expect(getActiveTab(mockTabs, '/tags/view/123')).toBe('tags');
    });

    it('should return matching tab name when path has multiple segments and later segment matches', () => {
      expect(getActiveTab(mockTabs, '/dashboard/subscription')).toBe('subscription');
      expect(getActiveTab(mockTabs, '/app/tags/filter')).toBe('tags');
    });

    it('should return first matching tab when multiple segments could match', () => {
      // In this case, it finds the first segment that matches any tab
      expect(getActiveTab(mockTabs, '/subscription/tags')).toBe('subscription');
    });

    it('should handle path without leading slash', () => {
      expect(getActiveTab(mockTabs, 'subscription')).toBe('subscription');
      expect(getActiveTab(mockTabs, 'tags/details')).toBe('tags');
    });

    it('should handle path with trailing slash', () => {
      expect(getActiveTab(mockTabs, '/subscription/')).toBe('subscription');
      expect(getActiveTab(mockTabs, '/tags/')).toBe('tags');
    });

    it('should return first tab name when tabs array has only one tab', () => {
      const singleTab = [{ name: 'single', url: 'single', title: 'Single' }];
      expect(getActiveTab(singleTab, '/other')).toBe('single');
      expect(getActiveTab(singleTab, '/single')).toBe('single');
    });
  });

  describe('getTabByName', () => {
    it('should return the tab object when name matches', () => {
      const result = getTabByName(mockTabs, 'subscription');
      expect(result).toEqual({
        name: 'subscription',
        url: 'subscription',
        title: 'Subscription',
      });
    });

    it('should return undefined when name does not match any tab', () => {
      expect(getTabByName(mockTabs, 'unknown')).toBeUndefined();
      expect(getTabByName(mockTabs, 'dashboard')).toBeUndefined();
    });

    it('should return undefined when tabs array is empty', () => {
      expect(getTabByName([], 'subscription')).toBeUndefined();
    });

    it('should return undefined when name is empty string', () => {
      expect(getTabByName(mockTabs, '')).toBeUndefined();
    });

    it('should return the correct tab when multiple tabs exist', () => {
      const result = getTabByName(mockTabs, 'tags');
      expect(result).toEqual({ name: 'tags', url: 'tags', title: 'Tags' });
    });

    it('should return the general-information tab when name matches', () => {
      const result = getTabByName(mockTabs, 'general-information');
      expect(result).toEqual({
        name: 'general-information',
        url: '',
        title: 'General Information',
      });
    });

    it('should return the first matching tab when multiple tabs have the same name', () => {
      const duplicateTabs: TabNavigationItem[] = [
        { name: 'test', url: 'first', title: 'First' },
        { name: 'test', url: 'second', title: 'Second' },
      ];
      const result = getTabByName(duplicateTabs, 'test');
      expect(result).toEqual({ name: 'test', url: 'first', title: 'First' });
    });

    it('should handle case-sensitive name matching', () => {
      expect(getTabByName(mockTabs, 'Subscription')).toBeUndefined();
      expect(getTabByName(mockTabs, 'SUBSCRIPTION')).toBeUndefined();
      expect(getTabByName(mockTabs, 'subscription')).toBeDefined();
    });
  });
});

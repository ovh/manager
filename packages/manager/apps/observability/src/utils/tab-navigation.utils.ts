import { TabNavigationItem } from '@/components/dashboard/tab-navigation/TabNavigationItem.type';

/**
 * Get the active tab based on the current path.
 */
export const getActiveTab = (tabs: TabNavigationItem[], currentPath: string): string => {
  if (!tabs || tabs.length === 0) return '';

  // split current path into segments
  const segments = currentPath.split('/').filter(Boolean);

  // find the first segment that matches any tab.url
  const tabSegment = segments.find((seg) => tabs.some((tab) => tab.url === seg)) || '';

  // find the matching tab
  const match = tabs.find((tab) => tab.url === tabSegment);

  // default: first tab if none matches
  return match ? match.name : tabs[0]?.name || '';
};

/**
 * Get the tab object by its name
 */
export const getTabByName = (
  tabs: TabNavigationItem[],
  name: string,
): TabNavigationItem | undefined => {
  return tabs.find((tab) => tab.name === name);
};

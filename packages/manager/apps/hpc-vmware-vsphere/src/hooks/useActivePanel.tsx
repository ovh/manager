import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardTabItem } from '@/types/DashboardTabItem';

const findMatchingTab = (
  pathname: string,
  tabs: DashboardTabItem[],
): DashboardTabItem | undefined => {
  return tabs.find((tab) => pathname.startsWith(tab.to));
};

export const useActivePanel = (
  tabsList: DashboardTabItem[],
): DashboardTabItem | undefined => {
  const location = useLocation();

  const activePanel = useMemo(() => {
    const initialActivePanel: DashboardTabItem | undefined = findMatchingTab(
      location.pathname,
      tabsList,
    );
    const activeTab = findMatchingTab(
      location.pathname,
      [...tabsList].reverse(),
    );
    if (activeTab) {
      return activeTab;
    }
    return initialActivePanel;
  }, [location.pathname, tabsList]);

  return activePanel;
};

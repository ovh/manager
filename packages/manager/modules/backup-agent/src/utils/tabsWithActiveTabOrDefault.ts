import { DashboardTabType } from '@/types/Dashboard.type';

export const tabsWithActiveTabOrDefault = <
  T extends Pick<DashboardTabType, 'isActive' | 'isDefault'>,
>(
  tabs: T[],
) => {
  if (tabs.every((tab) => tab.isActive === false))
    return tabs.map((tab) => ({ ...tab, isActive: !!tab.isDefault }));
  return tabs;
};

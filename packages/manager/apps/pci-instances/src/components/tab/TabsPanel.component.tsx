import { FC, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@datatr-ux/uxlib';
import { clsx } from 'clsx';

type TabItem = {
  label: string;
  to: string;
  count?: number;
};

const TabsPanel: FC<{ tabs: TabItem[] }> = ({ tabs }) => {
  const location = useLocation();

  const activeTab = useMemo(
    () => tabs.find((tab) => location.pathname === tab.to),
    [location.pathname, tabs],
  );

  return (
    <div className="flex border-b border-[#e6f5fc]">
      {tabs.map((tab, index) => (
        <NavLink
          key={`${tab.label}-${index}`}
          to={tab.to}
          className={clsx(
            'whitespace-nowrap w-fit text-[--ods-color-primary-500] text-base font-semibold m-0 py-2 hover:text-primary-700',
            activeTab?.to === tab.to &&
              'border-b-2 border-[--ods-color-primary-500]',
          )}
        >
          <span className="w-full px-6 flex gap-2 items-center">
            {tab.label}
            {tab.count && tab.count > 0 && (
              <Badge
                variant="primary"
                className="hidden md:block text-xs rounded-full"
              >
                {tab.count}
              </Badge>
            )}
          </span>
        </NavLink>
      ))}
    </div>
  );
};

export default TabsPanel;

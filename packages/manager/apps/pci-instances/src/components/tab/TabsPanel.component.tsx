import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabList,
  Tab,
  TabsValueChangeEvent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@ovhcloud/ods-react';

type TTabItem = {
  label: string;
  to: string;
  badge?: string;
  disabled?: boolean;
  tooltipText?: string;
};

type TTabsPanelProps = {
  tabs: TTabItem[];
};

const TabsPanel: FC<TTabsPanelProps> = ({ tabs }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event: TabsValueChangeEvent) =>
    navigate(event.value);

  useEffect(() => {
    const defaultTab = tabs.find((tab) => location.pathname === tab.to);

    if (defaultTab) setActiveTab(defaultTab.to);
  }, [location.pathname, tabs]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabList>
        {tabs.map((tab) => (
          <Tooltip key={tab.to}>
            <TooltipTrigger asChild>
              <Tab value={tab.to} disabled={tab.disabled}>
                {tab.label}
              </Tab>
            </TooltipTrigger>
            {tab.tooltipText && (
              <TooltipContent>{tab.tooltipText}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </TabList>
    </Tabs>
  );
};

export default TabsPanel;

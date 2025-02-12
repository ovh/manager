import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useTranslation } from 'react-i18next';

type TAllowedTabs = 'quota' | 'regions';

export type TTabItem = {
  id: TAllowedTabs;
  label: string;
  href: string;
};

export const TabsComponent = ({ activeTab }: { activeTab: TAllowedTabs }) => {
  const navigate = useNavigate();

  const { t: tRegions } = useTranslation('regions');
  const { t: tQuotas } = useTranslation('quotas');

  const items: TTabItem[] = [
    {
      id: 'quota',
      label: tQuotas('pci_projects_project_quota'),
      href: '../quota',
    },
    {
      id: 'regions',
      label: tRegions('pci_projects_project_regions'),
      href: '../regions',
    },
  ];

  return (
    <OdsTabs className="bg-green">
      {items.map((item) => (
        <OdsTab
          key={item.href}
          isSelected={item.id === activeTab}
          onClick={() => navigate(item.href)}
        >
          <div>{item.label}</div>
        </OdsTab>
      ))}
    </OdsTabs>
  );
};

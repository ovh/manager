import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { useTranslation } from 'react-i18next';

const allowedTabs = ['quota', 'regions'];

type TAllowedTabs = typeof allowedTabs[number];

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
          className=""
        >
          <div className="">{item.label}</div>
        </OdsTab>
      ))}
    </OdsTabs>
  );
};

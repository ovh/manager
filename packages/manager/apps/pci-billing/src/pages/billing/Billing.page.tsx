import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { Suspense, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useHref,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { sub } from 'date-fns';
import { ROUTE_PATHS } from '@/routes';
import TabsPanel from '@/components/TabsPanel.component';

export default function BillingPage() {
  const { t } = useTranslation('legacy');
  const location = useLocation();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const anteriorDate = sub(new Date(), { months: 1 });

  // date-fns begin the index of month in 0 instead of 1
  // Ex: January is 0, February is 1, etc.
  const historyHref = `history/${anteriorDate.getFullYear()}/${anteriorDate.getMonth() +
    1}`;

  const tabs = [
    {
      name: 'cpbc_tab_consumption',
      title: t('cpbc_tab_consumption'),
      to: useResolvedPath(ROUTE_PATHS.BILLING).pathname,
    },
    {
      name: 'cpbc_tab_forecast',
      title: t('cpbc_tab_forecast'),
      to: useResolvedPath(ROUTE_PATHS.ESTIMATE).pathname,
    },
    {
      name: 'cpbc_tab_history',
      title: t('cpbc_tab_history'),
      to: useResolvedPath(historyHref).pathname,
    },
  ];

  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.to);
    setActivePanelTranslation(t(activeTab?.name));
  }, [location.pathname]);

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            label: t('cpbc_billing_control'),
            href: useHref(ROUTE_PATHS.BILLING),
          },
          { label: activePanelTranslation },
        ]}
      />

      <div className="header mb-6 mt-8">
        <Headers
          title={t('cpbc_billing_control')}
          headerButton={<PciGuidesHeader category="instances" />}
        />
      </div>
      <div className="my-10">
        <TabsPanel tabs={tabs} />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}

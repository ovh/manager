import {
  PciFreeLocalZonesBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  Headers,
  Notifications,
  PciGuidesHeader,
  useFeatureAvailability,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { Suspense, useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useResolvedPath } from 'react-router-dom';
import { sub } from 'date-fns';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ROUTE_PATHS } from '@/routes';
import TabsPanel from '@/components/TabsPanel.component';
import { PCI_FEATURES_FREE_LOCAL_ZONES_BANNER } from '@/constants';

export default function BillingPage() {
  const { t } = useTranslation('consumption');
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const [activePanelName, setActivePanelName] = useState('');

  const anteriorDate = sub(new Date(), { months: 1 });

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { data: availability } = useFeatureAvailability([
    PCI_FEATURES_FREE_LOCAL_ZONES_BANNER,
  ]);

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
          { label: t(activePanelName) },
        ]}
      />

      <div className="header mt-8">
        <Headers
          title={t('cpbc_billing_control')}
          headerButton={<PciGuidesHeader category="instances" />}
        />
      </div>

      {availability && availability[PCI_FEATURES_FREE_LOCAL_ZONES_BANNER] && (
        <PciFreeLocalZonesBanner ovhSubsidiary={ovhSubsidiary} showConfirm />
      )}

      <Notifications />

      <div className="mb-10">
        <TabsPanel
          tabs={tabs}
          activePanelName={activePanelName}
          setActivePanelName={setActivePanelName}
        />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}

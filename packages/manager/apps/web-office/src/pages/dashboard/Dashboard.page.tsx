import { useContext } from 'react';

import { Outlet, useNavigate, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, GuideMenu, Notifications, useNotifications } from '@ovh-ux/muk';
import type { GuideMenuItem } from '@ovh-ux/muk';

import { GUIDES_LIST } from '@/Guides.constants';
import { GUIDES } from '@/Tracking.constants';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import TabsPanel from '@/components/tabs-panel/TabsPanel.component';
import { useParentTenant } from '@/data/hooks/parent-tenant/useParentTenant';
import { urls } from '@/routes/Routes.constants';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { trackClick } = useOvhTracking();
  const { data } = useParentTenant();
  const serviceName = data?.serviceName;
  const { t } = useTranslation(['common', NAMESPACES.DASHBOARD, NAMESPACES.ACTIONS]);
  const { notifications } = useNotifications();
  const basePath = useResolvedPath('').pathname;
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  function computePathMatchers(routes: string[]) {
    return routes.map((path) => new RegExp(path.replace(':serviceName', serviceName)));
  }
  const navigate = useNavigate();
  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'general-information',
      title: t(`${NAMESPACES.DASHBOARD}:general_information`),
      to: basePath,
      pathMatchers: computePathMatchers([urls.generalInformation]),
    },
    {
      name: 'users',
      title: t('licences'),
      to: `${basePath}/users`,
      pathMatchers: computePathMatchers([urls.users]),
    },
    {
      name: 'consumption',
      title: t('consumption'),
      to: `${basePath}/consumption`,
      pathMatchers: computePathMatchers([urls.consumption]),
    },
  ];

  const guideItems: GuideMenuItem[] = [
    {
      id: 1,
      href: GUIDES_LIST.office_guides.url[ovhSubsidiary] || GUIDES_LIST.office_guides.url.DEFAULT,
      target: '_blank',
      children: t('common_guides_header'),
      onClick: () => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.externalLink,
          actionType: 'action',
          actions: [GUIDES],
        });
      },
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      backLink={
        data?.mcaAgreed
          ? null
          : {
              label: t(`${NAMESPACES.ACTIONS}:back_to`, { value: t('common_office_title') }),
              onClick: () => navigate(urls.listing),
            }
      }
      header={{
        title: data?.mcaAgreed ? data?.serviceName : t('contract_signature'),
        guideMenu: <GuideMenu items={guideItems} />,
      }}
      tabs={data?.mcaAgreed ? <TabsPanel tabs={tabsList} /> : null}
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications /> : null
      }
    >
      <Outlet />
    </BaseLayout>
  );
}

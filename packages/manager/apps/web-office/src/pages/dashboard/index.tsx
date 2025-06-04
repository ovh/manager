import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useResolvedPath } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  useNotifications,
  GuideButton,
  GuideItem,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { GUIDES_LIST } from '@/guides.constants';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { urls } from '@/routes/routes.constants';
import TabsPanel from '@/components/tabsPanel/TabsPanel.component';
import { useParentTenant } from '@/data/hooks/parentTenant/useParentTenant';
import { GUIDES } from '@/tracking.constants';

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
  const { t } = useTranslation('common');
  const { notifications } = useNotifications();
  const basePath = useResolvedPath('').pathname;
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', serviceName)),
    );
  }
  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'general-information',
      title: t('general_informations'),
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

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: (GUIDES_LIST.office_guides.url[ovhSubsidiary] ||
        GUIDES_LIST.office_guides.url.DEFAULT) as string,
      target: '_blank',
      label: t('common_guides_header'),
      onClickReturn: () => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.externalLink,
          actionType: 'action',
          actions: [GUIDES],
        });
      },
    },
  ];
  const header = {
    title: data?.serviceName,
    headerButton: <GuideButton items={guideItems} />,
  };
  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      tabs={<TabsPanel tabs={tabsList} />}
      message={
        // temporary fix margin even if empty
        notifications.length ? <Notifications /> : null
      }
    >
      <Outlet />
    </BaseLayout>
  );
}

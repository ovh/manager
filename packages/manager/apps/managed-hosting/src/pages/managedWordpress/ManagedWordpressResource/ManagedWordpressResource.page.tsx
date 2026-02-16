import { Outlet, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout, ChangelogMenu, Notifications } from '@ovh-ux/muk';

import { GENERAL_INFORMATION, TASKS } from '@/Tracking.constants';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import TabsPanel, {
  TabItemProps,
  useComputePathMatchers,
} from '@/components/tabsPanel/TabsPanel.component';
import { useGenerateUrl } from '@/hooks/generateUrl/useGenerateUrl';
import { useOverridePage } from '@/hooks/overridePage/useOverridePage';
import { urls } from '@/routes/Routes.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

export default function ManagedWordpressResourcePage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const resolvedPath = useResolvedPath('');
  const basePath = resolvedPath?.pathname ?? '/';
  const isOverridedPage = useOverridePage();

  const tabsList: TabItemProps[] = [
    {
      name: 'general-information',
      trackingName: GENERAL_INFORMATION,
      title: t('common:web_hosting_header_my_websites'),
      to: useGenerateUrl(basePath, 'path'),
      pathMatchers: useComputePathMatchers([urls.managedWordpressResourceGeneralInformation]),
    },
    {
      name: 'tasks',
      trackingName: TASKS,
      title: t('common:web_hosting_header_tasks'),
      to: useGenerateUrl(`${basePath}/tasks`, 'path'),
      pathMatchers: useComputePathMatchers([urls.managedWordpressResourceTasks]),
    },
  ];

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={
        !isOverridedPage && {
          title: serviceName,
          changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
        }
      }
      message={<Notifications />}
      tabs={!isOverridedPage && <TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
}

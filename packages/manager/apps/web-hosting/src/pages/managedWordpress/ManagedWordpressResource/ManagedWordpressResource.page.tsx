import { Outlet, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  ChangelogButton,
  GuideButton,
  Notifications,
} from '@ovh-ux/manager-react-components';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import TabsPanel, {
  TabItemProps,
  useComputePathMatchers,
} from '@/components/tabsPanel/TabsPanel.component';
import { useGenerateUrl, useOverridePage } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { GENERAL_INFORMATION, TASKS } from '@/utils/tracking.constants';

import { useGuideItems } from './ManagedWordPressResource.constants';

export default function ManagedWordpressResourcePage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const resolvedPath = useResolvedPath('');
  const basePath = resolvedPath?.pathname ?? '/';
  const isOverridedPage = useOverridePage();
  const guideItems = useGuideItems(t);

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
          headerButton: <GuideButton items={guideItems} />,
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        }
      }
      message={<Notifications />}
      tabs={!isOverridedPage && <TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
}

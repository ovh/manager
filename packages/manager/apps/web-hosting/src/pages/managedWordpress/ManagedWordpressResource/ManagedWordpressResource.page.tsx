import {
  BaseLayout,
  GuideButton,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams, useResolvedPath } from 'react-router-dom';
import TabsPanel, {
  TabItemProps,
  useComputePathMatchers,
} from '@/components/tabsPanel/TabsPanel.component';
import { urls } from '@/routes/routes.constants';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { useGuideItems } from './ManagedWordPressResource.constants';
import { useGenerateUrl } from '@/hooks';
import { GENERAL_INFORMATION, TASKS } from '@/utils/tracking.constants';

export default function ManagedWordpressResourcePage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { serviceName } = useParams();
  const basePath = useResolvedPath('').pathname;

  const tabsList: TabItemProps[] = [
    {
      name: 'general-information',
      trackingName: GENERAL_INFORMATION,
      title: t('common:web_hosting_header_my_websites'),
      to: useGenerateUrl(basePath, 'path'),
      pathMatchers: useComputePathMatchers([
        urls.managedWordpressResourceGeneralInformation,
      ]),
    },
    {
      name: 'tasks',
      trackingName: TASKS,
      title: t('common:web_hosting_header_tasks'),
      to: useGenerateUrl(`${basePath}/tasks`, 'path'),
      pathMatchers: useComputePathMatchers([
        urls.managedWordpressResourceTasks,
      ]),
    },
  ];
  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: serviceName,
        headerButton: <GuideButton items={useGuideItems(t)} />,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        description: t(
          'dashboard:hosting_managed_wordpress_websites_description',
        ),
      }}
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
}

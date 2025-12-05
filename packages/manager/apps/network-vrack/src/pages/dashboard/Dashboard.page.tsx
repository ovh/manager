import { Outlet, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Spinner, Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { BaseLayout, Breadcrumb, ChangelogMenu } from '@ovh-ux/muk';

import { appName } from '@/App.constants';
import { DashboardHeaderTitle } from '@/components/DashboardHeaderTitle';
import { GuideMenuWithSurvey } from '@/components/GuideMenuWithSurvey';
import { useGetVrackDetails } from '@/hooks/vrack/useGetVrackDetails';
import { CHANGELOG_CHAPTERS, CHANGELOG_LINKS } from '@/utils/constants';

import NotFound from '../not-found/404.page';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const { data: vrack, isLoading } = useGetVrackDetails(serviceName || '');

  if (isLoading) {
    return <Spinner />;
  } else if (!vrack) {
    return <NotFound />;
  }

  return (
    !!vrack && (
      <BaseLayout
        breadcrumb={
          <Breadcrumb appName={appName} rootLabel={t('dashboard_vrackBreadcrumbLabel')} />
        }
        header={{
          title: <DashboardHeaderTitle vrack={vrack} />,
          changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />,
          guideMenu: <GuideMenuWithSurvey />,
        }}
        tabs={
          <Tabs value="vrack.dashboard.publicIpRouting">
            <TabList>
              <Tab value="vrack.dashboard.publicIpRouting">
                {t('dashboard_publicIpConnectivityTab')}
              </Tab>
            </TabList>
          </Tabs>
        }
      >
        <Outlet />
      </BaseLayout>
    )
  );
}

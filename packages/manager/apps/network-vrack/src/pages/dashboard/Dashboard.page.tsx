import { Outlet, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Spinner, Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { BaseLayout, Breadcrumb, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';

import { appName } from '@/App.constants';
import { DashboardHeaderTitle } from '@/components/DashboardHeaderTitle';
import { DashboardSubtitle } from '@/components/DashboardSubtitle';
import { SurveyLink } from '@/components/SurveyLink';
import { useGuideLinks } from '@/hooks/useGuideLinks';
import { useGetVrackDetails } from '@/hooks/vrack/useGetVrackDetails';
import { CHANGELOG_CHAPTERS, CHANGELOG_LINKS } from '@/utils/constants';

import NotFound from '../not-found/Error404.page';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const guideItems = useGuideLinks();
  const { data: vrack, isLoading } = useGetVrackDetails(serviceName);

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
          guideMenu: <GuideMenu items={guideItems} />,
        }}
        tabs={
          <>
            <span className="flex">
              <DashboardSubtitle vrack={vrack} />
              <SurveyLink />
            </span>
            <Tabs value="vrack.dashboard.publicIpRouting">
              <TabList>
                <Tab value="vrack.dashboard.publicIpRouting">
                  {t('dashboard_publicIpConnectivityTab')}
                </Tab>
              </TabList>
            </Tabs>
          </>
        }
      >
        <Outlet />
      </BaseLayout>
    )
  );
}

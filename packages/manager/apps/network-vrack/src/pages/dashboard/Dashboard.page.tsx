import { Outlet, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Spinner, Tab, TabList, Tabs } from '@ovhcloud/ods-react';
import type { TabsValueChangeEvent } from '@ovhcloud/ods-react';

import { BaseLayout, ChangelogMenu, GuideMenu, Notifications } from '@ovh-ux/muk';

import { DashboardHeaderTitle } from '@/components/DashboardHeaderTitle';
import { DashboardSubtitle } from '@/components/DashboardSubtitle';
import { SurveyLink } from '@/components/SurveyLink';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb';
import { useGuideLinks } from '@/hooks/useGuideLinks';
import { useNavigateToLegacyApp } from '@/hooks/useNavigateToLegacyApp';
import { useGetVrackDetails } from '@/hooks/vrack/useGetVrackDetails';
import { CHANGELOG_CHAPTERS, CHANGELOG_LINKS } from '@/utils/constants';

import NotFound from '../not-found/Error404.page';

export default function DashboardPage() {
  const VRACK_LISTING_TAB = 'listing';
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation('dashboard');
  const guideItems = useGuideLinks();
  const { data: vrack, isLoading } = useGetVrackDetails(serviceName);
  const navigateToLegacy = useNavigateToLegacyApp();

  if (isLoading) {
    return <Spinner />;
  } else if (!vrack) {
    return <NotFound />;
  }

  const onTabChange = ({ value }: TabsValueChangeEvent) => {
    if (value === VRACK_LISTING_TAB) {
      navigateToLegacy(serviceName);
    }
  };

  return (
    !!vrack && (
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={{
          title: <DashboardHeaderTitle vrack={vrack} />,
          changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} chapters={CHANGELOG_CHAPTERS} />,
          guideMenu: <GuideMenu items={guideItems} />,
        }}
        message={<Notifications />}
        tabs={
          <>
            <span className="flex">
              <DashboardSubtitle vrack={vrack} />
              <SurveyLink />
            </span>
            <Tabs value="vrack.dashboard.publicIpRouting" onValueChange={onTabChange}>
              <TabList>
                <Tab value={VRACK_LISTING_TAB}>{t('dashboard_allAttachedServicesTab')}</Tab>
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

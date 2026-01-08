import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { Breadcrumb } from '@ovh-ux/manager-react-components';
import { BaseLayout, HeaderProps } from '@ovh-ux/muk';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';
import { GuidePlacement, GuidedTourProvider, GuideStep } from '@/hooks/useGuidedTour';
import SenderEmailBanner from '@/components/senderEmailBanner/SenderEmailBanner.component'
import { GuideMenu } from '@/components/guideMenu/GuideMenu.component';
import GuidedTour from '@/components/guidedTour/GuidedTour.component';
import GuidedTourIntroduction from '@/components/guidedTour/Introduction.component';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function DashboardLayout() {
  const { trackClick } = useTracking();
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const steps: GuideStep[] = [
    {
      route: urls.communication.listing,
      anchor: '#communications-tab',
      text: t('guided_tour_communications'),
      placement: GuidePlacement.Bottom,
      onAfterEnter: () => {
        // tracking the guide_tab_communications step
      },
    },
    {
      route: urls.contact.listing,
      anchor: '#contacts-tab',
      text: t('guided_tour_contacts'),
      placement: GuidePlacement.Bottom,
      onAfterEnter: () => {
        // tracking the guide_tab_contacts step
      },
    },

    {
      route: urls.routing.listing,
      anchor: '#rules-parameter-tab',
      text: t('guided_tour_settings'),
      placement: GuidePlacement.Bottom,
      onAfterEnter: () => {
        // tracking the guide_tab_settings step
      },
    },
  ];
  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'communications',
      title: t('tab_communications'),
      to: useResolvedPath(urls.communication.listing).pathname,
    },
    {
      name: 'contacts',
      title: t('tab_contacts'),
      to: useResolvedPath(urls.contact.listing).pathname,
    },
    {
      name: 'rules-parameter',
      title: t('tab_settings'),
      to: useResolvedPath(urls.routing.listing).pathname,
    },
  ];

  useEffect(() => {
    const matchesPath = (path: string, tabPath: string): boolean => {
      if (tabPath === '/') {
        return path === '/';
      }
      return path === tabPath || path.startsWith(`${tabPath}/`);
    };

    const activeTab = tabsList.find((tab) =>
      matchesPath(location.pathname, tab.to),
    );
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabsList[0]?.name ?? '');
    }
  }, [location.pathname, tabsList]);

  const header: HeaderProps = {
    title: t('title'),
    guideMenu: <GuideMenu />,
  };

  return (
    <GuidedTourProvider steps={steps} postGuideRoute={urls.communication.listing}>
      <BaseLayout
        breadcrumb={<Breadcrumb rootLabel={t('title')} appName="communication" />}
        header={header}
        tabs={
          <OdsTabs>
            {tabsList.map((tab: DashboardTabItemProps) => (
              <OdsTab
                key={`osds-tab-bar-item-${tab.name}`}
                id={`${tab.name}-tab`}
                className="select-none"
                isSelected={tab.name === panel}
                onOdsTabSelected={() => {
                  trackClick({
                    location: PageLocation.mainTabnav,
                    actionType: 'navigation',
                    buttonType: ButtonType.tab,
                    actions: [tab.name],
                    subApp:
                      TrackingSubApps[tab.name as keyof typeof TrackingSubApps],
                  });
                  navigate(tab.to);
                }}
              >
                {tab.title}
              </OdsTab>
            ))}
          </OdsTabs>
        }
      >
        <SenderEmailBanner />

        <Outlet />
        <GuidedTourIntroduction />
      </BaseLayout>
      <GuidedTour />
    </GuidedTourProvider>
  );
}

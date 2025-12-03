import { Suspense, useContext, useMemo } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, ChangelogMenu, GuideMenu, Message } from '@ovh-ux/muk';

import { Breadcrumb } from '@ovh-ux/manager-react-components';

import { APP_NAME } from '@/Tracking.constants';
import { AppConfig, appName } from '@/App.constants';
import BillingTile from '@/components/billing-tile/BillingTile.component';
import ConfigurationTile from '@/components/dashboard/ConfigurationTile.component';
import InformationTile from '@/components/dashboard/InformationTile.component';
import { GUIDES_URL } from '@/constants/Nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useIsCommitmentAvailable } from '@/hooks/dashboard/useIsCommitmentAvailable';
import { useIsNashaEolServiceBannerAvailable } from '@/hooks/dashboard/useIsNashaEolServiceBannerAvailable';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { useServiceInfo } from '@/hooks/dashboard/useServiceInfo';
import { useUsageMetrics } from '@/hooks/dashboard/useUsageMetrics';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'dashboard']);
  const location = useLocation();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  // Fetch data
  const { data: nasha, isLoading: isNashaLoading } = useNashaDetail(serviceName ?? '');
  const { data: serviceInfo } = useServiceInfo(serviceName ?? '');
  const { canCreatePartitions } = useCanCreatePartitions(serviceName ?? '');
  const isCommitmentAvailable = useIsCommitmentAvailable();
  const isNashaEolServiceBannerAvailable = useIsNashaEolServiceBannerAvailable(serviceName ?? '');

  // Computed values
  const displayName = useMemo(
    () => nasha?.customName || nasha?.serviceName || serviceName,
    [nasha, serviceName],
  );
  const nashaGuidesUrl = useMemo(
    () => GUIDES_URL[ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT,
    [ovhSubsidiary],
  );

  // Tabs configuration
  const tabs = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('dashboard:tabs.general_information'),
        to: '.', // Current route (dashboard)
        isActive:
          location.pathname.includes('/dashboard/') && !location.pathname.includes('/partitions'),
      },
      {
        name: 'partitions',
        title: t('dashboard:tabs.partitions'),
        to: 'partitions', // Relative route to partitions
        isActive: location.pathname.includes('/partitions'),
      },
    ],
    [t, location.pathname],
  );

  // Get active tab value
  const activeTabValue = useMemo(() => {
    const activeTab = tabs.find((tab) => tab.isActive);
    return activeTab?.name || tabs[0]?.name || '';
  }, [tabs]);

  // Handle tab change
  const handleTabChange = (event: TabsValueChangeEvent) => {
    const tab = tabs.find((t) => t.name === event.value);
    if (tab) {
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.tab,
        actionType: 'navigation',
        actions: [APP_NAME, 'dashboard', tab.name],
      });
      void navigate(tab.to);
    }
  };

  // Calculate usage metrics
  const { spaceLeftDisplay, usagePercentage } = useUsageMetrics(nasha?.use);

  // Header actions
  const handleEditName = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'edit-name'],
    });
    // Navigate to edit-name route (route-based modal) - use relative path
    void navigate('edit-name');
  };

  const handleCreatePartition = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'create-partition'],
    });
    // Navigate to create partition route using relative path
    void navigate('partitions/create');
  };

  const handleGuideClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [APP_NAME, 'dashboard', 'guides'],
    });
  };

  if (isNashaLoading) {
    return <div>Loading...</div>;
  }

  if (!nasha) {
    return <div>Service not found</div>;
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} />}
      header={{
        title: displayName,
        changelogButton: (
          <ChangelogMenu
            links={{
              changelog: 'https://github.com/ovh/manager',
              roadmap: 'https://github.com/ovh/manager',
              'feature-request': 'https://github.com/ovh/manager',
            }}
          />
        ),
        guideMenu: (
          <GuideMenu
            items={[
              {
                id: 1,
                href: nashaGuidesUrl,
                target: '_blank',
                label: t('dashboard:guides.title'),
                onClick: handleGuideClick,
              },
            ]}
          />
        ),
      }}
      tabs={
        <Tabs value={activeTabValue} onValueChange={handleTabChange}>
          <TabList>
            {tabs.map((tab) => (
              <Tab key={tab.name} value={tab.name}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      }
    >
      {/* EOL Banner */}
      {isNashaEolServiceBannerAvailable && (
        <Message color="warning" className="mb-4">
          {t('dashboard:eol_banner_message', 'This service is in end-of-life period')}
        </Message>
      )}

      {/* General Information View */}
      {!location.pathname.includes('/partitions') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Information Tile */}
          <InformationTile nasha={nasha} displayName={displayName} onEditName={handleEditName} />

          {/* Configuration Tile */}
          <ConfigurationTile
            usage={nasha.use}
            spaceLeftDisplay={spaceLeftDisplay}
            usagePercentage={usagePercentage}
            canCreatePartitions={canCreatePartitions}
            onCreatePartition={handleCreatePartition}
          />

          {/* Billing Tile */}
          <BillingTile
            serviceInfo={serviceInfo}
            isLoading={!serviceInfo}
            serviceName={serviceName}
            withEngagement={isCommitmentAvailable}
            trackingPrefix="Storage_backup::storage_backup::nasha"
            trackingPage="Storage_backup::storage_backup::nasha::nasha::dashboard::general-information"
            trackingNameSuffix="nasha"
          />
        </div>
      )}

      {/* Nested routes (partitions, edit-name, etc.) */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}

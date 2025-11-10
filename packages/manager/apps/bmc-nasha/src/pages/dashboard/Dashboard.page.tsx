import { Suspense, useContext, useMemo } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, ChangelogMenu, GuideMenu, Icon, Tile } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import BillingTile from '@/components/BillingTile/BillingTile.component';
import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { GUIDES_URL } from '@/constants/nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useIsNashaEolServiceBannerAvailable } from '@/hooks/dashboard/useIsNashaEolServiceBannerAvailable';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { useServiceInfo } from '@/hooks/dashboard/useServiceInfo';

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
  const isNashaEolServiceBannerAvailable = useIsNashaEolServiceBannerAvailable(
    serviceName ?? '',
  ) as boolean;

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

  // Header actions
  const handleEditName = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'edit-name'],
    });
    // Navigate to edit-name route (route-based modal) - use relative path
    navigate('edit-name');
  };

  const handleCreatePartition = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'create-partition'],
    });
    // Navigate to create partition route using relative path
    navigate('partitions/create');
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
      breadcrumb={<Breadcrumb />}
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
        <Tabs
          value={activeTabValue}
          onValueChange={(event) => {
            const tab = tabs.find((t) => t.name === event.value);
            if (tab) {
              navigate(tab.to);
            }
          }}
        >
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
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            {t('dashboard:eol_banner_message', 'This service is in end-of-life period')}
          </p>
        </div>
      )}

      {/* General Information View */}
      {!location.pathname.includes('/partitions') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Information Tile */}
          <Tile.Root title={t('dashboard:information.title')}>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:information.name')} />
              <Tile.Item.Description>
                <div className="flex items-center">
                  <span>{displayName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditName}
                    className="ml-2"
                    aria-label={t('dashboard:edit', 'Edit')}
                  >
                    <Icon name="pen" />
                  </Button>
                </div>
              </Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:information.id')} />
              <Tile.Item.Description>{nasha.serviceName}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:information.datacenter')} />
              <Tile.Item.Description>{nasha.localeDatacenter}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:information.disk_type')} />
              <Tile.Item.Description>{nasha.diskType}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:information.disk_size')} />
              <Tile.Item.Description>{nasha.diskSize}</Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>

          {/* Configuration Tile */}
          <Tile.Root title={t('dashboard:configuration.title')}>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('dashboard:configuration.quota')} />
              <Tile.Item.Description>
                <SpaceMeter usage={nasha.use} large legend />
                <button
                  type="button"
                  onClick={handleCreatePartition}
                  disabled={!canCreatePartitions}
                  className="mt-4 text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('dashboard:configuration.link')} →
                </button>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>

          {/* Billing Tile */}
          <BillingTile
            serviceInfo={serviceInfo}
            isLoading={!serviceInfo}
            serviceName={serviceName}
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

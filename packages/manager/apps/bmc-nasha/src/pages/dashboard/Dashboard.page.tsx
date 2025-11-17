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
import {
  BaseLayout,
  Button,
  ChangelogMenu,
  GuideMenu,
  Icon,
  Message,
  Meter,
  Text,
  Tile,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import BillingTile from '@/components/BillingTile/BillingTile.component';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import { GUIDES_URL, NASHA_USE_SIZE_NAME } from '@/constants/nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useIsCommitmentAvailable } from '@/hooks/dashboard/useIsCommitmentAvailable';
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
  const isCommitmentAvailable = useIsCommitmentAvailable();
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

  // Calculate space left display (like the original filter)
  // The original uses usage.used, not totalUsed
  const spaceLeftDisplay = useMemo(() => {
    if (!nasha?.use || !nasha.use[NASHA_USE_SIZE_NAME] || !nasha.use.used) return null;
    const size = nasha.use[NASHA_USE_SIZE_NAME];
    const used = nasha.use.used;
    const maxSize = size.value;
    const usedValue = used.value;
    const ratio = maxSize > 0 ? ((usedValue / maxSize) * 100).toFixed(2) : '0.00';

    return {
      used: { value: usedValue, unit: used.unit },
      total: { value: maxSize, unit: size.unit },
      ratio: parseFloat(ratio),
    };
  }, [nasha?.use]);

  // Calculate usage percentage for Meter (using totalUsed for the meter)
  const usagePercentage = useMemo(() => {
    if (!nasha?.use) return 0;
    const size = nasha.use[NASHA_USE_SIZE_NAME];
    if (!size) return 0;

    const maxSize = size.value;
    const totalUsed = Object.entries(nasha.use)
      .filter(([key]) => key !== NASHA_USE_SIZE_NAME)
      .reduce((sum, [, data]) => sum + (data.value || 0), 0);

    return maxSize > 0 ? Math.round((totalUsed / maxSize) * 100) : 0;
  }, [nasha?.use]);

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
        title: (
          <div>
            <div>{displayName}</div>
            <div className="text-sm text-gray-600 mt-1">{nasha.serviceName}</div>
          </div>
        ),
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
        <Message color="warning" className="mb-4">
          {t('dashboard:eol_banner_message', 'This service is in end-of-life period')}
        </Message>
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
                <div className="space-y-4">
                  {/* Space Left Display (like original) */}
                  {spaceLeftDisplay && (
                    <div className="mb-4 flex items-center gap-2">
                      <Text preset="paragraph" className="text-sm font-semibold">
                        {spaceLeftDisplay.used.value} {spaceLeftDisplay.used.unit} /{' '}
                        {spaceLeftDisplay.total.value} {spaceLeftDisplay.total.unit} (
                        {spaceLeftDisplay.ratio}%)
                      </Text>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Icon
                            name="circle-question"
                            className="ml-2 cursor-help"
                            aria-label={t('dashboard:configuration.quota_help', 'Help')}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text preset="paragraph">
                            {t(
                              'dashboard:configuration.quota_help_text',
                              'The total capacity displayed corresponds to your HA-NAS volume — 20% more storage is added to it for your snapshots.',
                            )}
                          </Text>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}

                  {/* Meter */}
                  {nasha.use && (
                    <div className="w-full">
                      <Meter
                        value={usagePercentage}
                        min={0}
                        max={100}
                        low={40}
                        high={80}
                        optimum={30}
                      />
                    </div>
                  )}

                  {/* Create partition link */}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCreatePartition}
                    disabled={!canCreatePartitions}
                    className="mt-4"
                  >
                    <span className="flex items-center">
                      {t('dashboard:configuration.link')}
                      <Icon name="arrow-right" className="ml-2" />
                    </span>
                  </Button>
                </div>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>

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

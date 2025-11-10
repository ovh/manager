import { Suspense, useContext, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, Tile } from '@ovh-ux/muk';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useFeatureAvailability,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { GUIDES_URL } from '@/constants/nasha.constants';
import { useCanCreatePartitions } from '@/hooks/dashboard/useCanCreatePartitions';
import { useIsNashaEolServiceBannerAvailable } from '@/hooks/dashboard/useIsNashaEolServiceBannerAvailable';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { useServiceInfo } from '@/hooks/dashboard/useServiceInfo';
import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';

import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';

export default function DashboardPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'dashboard']);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackClick } = useOvhTracking();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  // Fetch data
  const { data: nasha, isLoading: isNashaLoading } = useNashaDetail(serviceName ?? '');
  const { data: serviceInfo } = useServiceInfo(serviceName ?? '');
  const { canCreatePartitions } = useCanCreatePartitions(serviceName ?? '');
  const { data: features } = useFeatureAvailability(['billing:commitment']);
  const isNashaEolServiceBannerAvailable = useIsNashaEolServiceBannerAvailable(serviceName ?? '');

  // Get URLs
  const { data: editNameUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/edit-name`,
    {},
  ]);
  const { data: partitionsCreateUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/partitions/create`,
    {},
  ]);

  // Computed values
  const displayName = useMemo(() => nasha?.customName || nasha?.serviceName || serviceName, [nasha, serviceName]);
  const nashaGuidesUrl = useMemo(
    () => GUIDES_URL[ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT,
    [ovhSubsidiary],
  );
  const isCommitmentAvailable = useMemo(
    () => features?.['billing:commitment']?.isFeatureAvailable('billing:commitment') ?? false,
    [features],
  );

  // Tabs configuration
  const tabs = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('dashboard:tabs.general_information'),
        to: `../${urls.dashboard.replace(':serviceName', serviceName ?? '')}`,
        isActive: location.pathname.includes('/dashboard/') && !location.pathname.includes('/partitions'),
      },
      {
        name: 'partitions',
        title: t('dashboard:tabs.partitions'),
        to: `../${urls.partitions.replace(':serviceName', serviceName ?? '')}`,
        isActive: location.pathname.includes('/partitions'),
      },
    ],
    [t, serviceName, location.pathname],
  );

  // Header actions
  const handleEditName = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'edit-name'],
    });
    if (editNameUrl) {
      window.location.href = editNameUrl as string;
    }
  };

  const handleCreatePartition = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'dashboard', 'create-partition'],
    });
    if (partitionsCreateUrl) {
      window.location.href = partitionsCreateUrl as string;
    }
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
      header={{
        title: displayName,
        description: serviceName,
        headerButton: (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEditName}
              className="p-2 hover:bg-gray-100 rounded"
              title={t('dashboard:edit')}
            >
              <span className="text-lg">✏️</span>
            </button>
          </div>
        ),
        changelogButton: true,
        guideMenu: {
          items: [
            {
              id: 1,
              href: nashaGuidesUrl,
              target: '_blank',
              label: t('dashboard:guides.title'),
              onClickReturn: handleGuideClick,
            },
          ],
        },
      }}
      tabs={
        <OdsTabs>
          {tabs.map((tab) => (
            <NavLink key={tab.name} to={tab.to} className="no-underline">
              <OdsTab isSelected={tab.isActive}>{tab.title}</OdsTab>
            </NavLink>
          ))}
        </OdsTabs>
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
                {displayName}
                <button
                  type="button"
                  onClick={handleEditName}
                  className="ml-2 text-primary hover:underline text-sm"
                >
                  {t('dashboard:edit')}
                </button>
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

          {/* Billing Tile - TODO: Implement BillingSubscriptionTile when available */}
          <Tile.Root title="Billing">
            <Tile.Item.Root>
              <Tile.Item.Description>
                <p className="text-sm text-gray-600">
                  {t('dashboard:billing.placeholder', 'Billing information will be displayed here')}
                </p>
              </Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>
        </div>
      )}

      {/* Nested routes (partitions, edit-name, etc.) */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}


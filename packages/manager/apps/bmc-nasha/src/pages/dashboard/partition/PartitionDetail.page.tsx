import { Suspense, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, Tile } from '@ovh-ux/muk';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';
import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';

import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';

export default function PartitionDetailPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: partition, isLoading: isPartitionLoading } = usePartitionDetail(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: nasha } = useNashaDetail(serviceName ?? '');

  // Get URLs
  const { data: editDescriptionUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/partition/${partitionName}/edit-description`,
    {},
  ]);
  const { data: editSizeUrl } = useNavigationGetUrl([
    'dedicated',
    `#/nasha/${serviceName}/partition/${partitionName}/edit-size`,
    {},
  ]);

  // Tabs configuration
  const tabs = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('partition:tabs.general_information'),
        to: `../${urls.partitionDetail.replace(':serviceName', serviceName ?? '').replace(':partitionName', partitionName ?? '')}`,
        isActive:
          location.pathname.includes('/partition/') &&
          !location.pathname.includes('/accesses') &&
          !location.pathname.includes('/snapshots'),
      },
      {
        name: 'snapshots',
        title: t('partition:tabs.snapshots'),
        to: `../${urls.partitionSnapshots.replace(':serviceName', serviceName ?? '').replace(':partitionName', partitionName ?? '')}`,
        isActive: location.pathname.includes('/snapshots'),
      },
      {
        name: 'accesses',
        title: t('partition:tabs.accesses'),
        to: `../${urls.partitionAccesses.replace(':serviceName', serviceName ?? '').replace(':partitionName', partitionName ?? '')}`,
        isActive: location.pathname.includes('/accesses'),
      },
    ],
    [t, serviceName, partitionName, location.pathname],
  );

  // Handle edit actions
  const handleEditDescription = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description'],
    });
    if (editDescriptionUrl) {
      window.location.href = editDescriptionUrl as string;
    }
  };

  const handleEditSize = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size'],
    });
    if (editSizeUrl) {
      window.location.href = editSizeUrl as string;
    }
  };

  if (isPartitionLoading) {
    return <div>Loading...</div>;
  }

  if (!partition) {
    return <div>Partition not found</div>;
  }

  return (
    <BaseLayout
      header={{
        title: partition.partitionName,
        description: serviceName,
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
      {/* General Information View */}
      {!location.pathname.includes('/accesses') && !location.pathname.includes('/snapshots') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Information Tile */}
          <Tile.Root title={t('partition:information.title')}>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('partition:information.name')} />
              <Tile.Item.Description>{partition.partitionName}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('partition:information.description')} />
              <Tile.Item.Description>
                {partition.partitionDescription || (
                  <em>{t('partition:information.description_none', 'No description')}</em>
                )}
                <button
                  type="button"
                  onClick={handleEditDescription}
                  className="ml-2 text-primary hover:underline text-sm"
                >
                  {t('partition:edit', 'Edit')}
                </button>
              </Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('partition:information.protocol')} />
              <Tile.Item.Description>{partition.protocol || '-'}</Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('partition:information.size')} />
              <Tile.Item.Description>
                {partition.use?.size ? (
                  <>
                    {partition.use.size.value} {partition.use.size.unit}
                    <button
                      type="button"
                      onClick={handleEditSize}
                      className="ml-2 text-primary hover:underline text-sm"
                    >
                      {t('partition:edit', 'Edit')}
                    </button>
                  </>
                ) : (
                  '-'
                )}
              </Tile.Item.Description>
            </Tile.Item.Root>
            <Tile.Item.Root>
              <Tile.Item.Term label={t('partition:information.quota')} />
              <Tile.Item.Description>
                {partition.use ? <SpaceMeter usage={partition.use} large /> : '-'}
              </Tile.Item.Description>
            </Tile.Item.Root>
          </Tile.Root>
        </div>
      )}

      {/* Nested routes (accesses, snapshots, edit-description, edit-size, etc.) */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}




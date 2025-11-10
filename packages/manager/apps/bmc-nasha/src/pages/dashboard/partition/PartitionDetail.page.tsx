import { Suspense, useMemo, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { BaseLayout, Tile, Meter, Modal, FormField, Input, Button } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';
import { urls } from '@/routes/Routes.constants';
import { APP_NAME } from '@/Tracking.constants';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import SpaceMeter from '@/components/SpaceMeter/SpaceMeter.component';

const DESCRIPTION_MAX = 50;

export default function PartitionDetailPage() {
  const { serviceName, partitionName } = useParams<{ serviceName: string; partitionName: string }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: partition, isLoading: isPartitionLoading, refetch: refetchPartition } = usePartitionDetail(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: nasha } = useNashaDetail(serviceName ?? '');

  // Modal state for edit description
  const [isEditDescriptionModalOpen, setIsEditDescriptionModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // Initialize description when partition loads or modal opens
  useEffect(() => {
    if (partition && isEditDescriptionModalOpen) {
      setDescription(partition.partitionDescription || '');
      setDescriptionError(null);
    }
  }, [partition, isEditDescriptionModalOpen]);

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

  // Get active tab value
  const activeTabValue = useMemo(() => {
    const activeTab = tabs.find((tab) => tab.isActive);
    return activeTab?.name || tabs[0]?.name || '';
  }, [tabs]);

  // Handle edit description modal
  const handleEditDescription = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description'],
    });
    setIsEditDescriptionModalOpen(true);
  };

  const handleCloseEditDescriptionModal = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'cancel'],
    });
    setIsEditDescriptionModalOpen(false);
    setDescriptionError(null);
  };

  const handleSubmitDescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !partitionName) return;

    if (description.length > DESCRIPTION_MAX) {
      setDescriptionError(t('partition:edit_description.max_length', `Maximum ${DESCRIPTION_MAX} characters`));
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-description', 'confirm'],
    });

    setIsUpdatingDescription(true);
    setDescriptionError(null);

    try {
      await httpV6.put(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
        {
          partitionDescription: description.trim(),
        },
      );

      // Refresh partition data
      await refetchPartition();

      // Close modal
      setIsEditDescriptionModalOpen(false);
    } catch (err) {
      setDescriptionError((err as Error).message || t('partition:edit_description.error', 'An error occurred'));
      setIsUpdatingDescription(false);
    }
  };

  const handleEditSize = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size'],
    });
    // Navigate to the edit-size route using full path with parameters
    navigate(
      urls.partitionEditSize
        .replace(':serviceName', serviceName ?? '')
        .replace(':partitionName', partitionName ?? ''),
    );
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

      {/* Nested routes (accesses, snapshots, edit-size, etc.) */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>

      {/* Edit Description Modal */}
      <Modal
        open={isEditDescriptionModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEditDescriptionModal();
          }
        }}
        heading={t('partition:edit_description.title', { name: partitionName }, `Edit description for ${partitionName}`)}
      >
        <form onSubmit={handleSubmitDescription} className="space-y-4">
          <FormField error={descriptionError || undefined}>
            <FormField.Label>
              {t('partition:edit_description.label', 'Description')}
            </FormField.Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={DESCRIPTION_MAX}
              disabled={isUpdatingDescription}
              required
            />
            <FormField.Helper>
              {t('partition:edit_description.helper', `Maximum ${DESCRIPTION_MAX} characters`)}
            </FormField.Helper>
          </FormField>

          <div className="flex gap-4 justify-end mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseEditDescriptionModal}
              disabled={isUpdatingDescription}
            >
              {t('partition:edit_description.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isUpdatingDescription || description === (partition?.partitionDescription || '')}
              isLoading={isUpdatingDescription}
            >
              {t('partition:edit_description.confirm', 'Confirm')}
            </Button>
          </div>
        </form>
      </Modal>
    </BaseLayout>
  );
}




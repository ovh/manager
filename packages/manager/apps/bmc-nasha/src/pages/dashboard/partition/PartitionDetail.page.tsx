import { Suspense, useMemo, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout } from '@ovh-ux/muk';

import { APP_NAME } from '@/Tracking.constants';
import { EditDescriptionModal } from '@/components/partition/EditDescriptionModal.component';
import { PartitionInformationTile } from '@/components/partition/PartitionInformationTile.component';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';

export default function PartitionDetailPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackClick } = useOvhTracking();

  // Fetch data
  const {
    data: partition,
    isLoading: isPartitionLoading,
    refetch: refetchPartition,
  } = usePartitionDetail(serviceName ?? '', partitionName ?? '');

  // Modal state for edit description
  const [isEditDescriptionModalOpen, setIsEditDescriptionModalOpen] = useState(false);

  // Tabs configuration
  const tabs = useMemo(
    () => [
      {
        name: 'general-information',
        title: t('partition:tabs.general_information'),
        to: '.', // Current route (partition detail)
        isActive:
          location.pathname.includes('/partition/') &&
          !location.pathname.includes('/accesses') &&
          !location.pathname.includes('/snapshots'),
      },
      {
        name: 'snapshots',
        title: t('partition:tabs.snapshots'),
        to: 'snapshots', // Relative route to snapshots
        isActive: location.pathname.includes('/snapshots'),
      },
      {
        name: 'accesses',
        title: t('partition:tabs.accesses'),
        to: 'accesses', // Relative route to accesses
        isActive: location.pathname.includes('/accesses'),
      },
    ],
    [t, location.pathname],
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
  };

  const handleEditSize = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'edit-size'],
    });
    // Navigate to edit-size route using relative path
    void navigate('edit-size');
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
      }}
      tabs={
        <Tabs
          value={activeTabValue}
          onValueChange={(event) => {
            const tab = tabs.find((t) => t.name === event.value);
            if (tab) {
              void navigate(tab.to);
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
          <PartitionInformationTile
            partition={partition}
            onEditDescription={handleEditDescription}
            onEditSize={handleEditSize}
          />
        </div>
      )}

      {/* Nested routes (accesses, snapshots, edit-size, etc.) */}
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>

      {/* Edit Description Modal */}
      <EditDescriptionModal
        isOpen={isEditDescriptionModalOpen}
        partitionName={partitionName}
        currentDescription={partition?.partitionDescription || ''}
        serviceName={serviceName}
        partitionDescription={partition?.partitionDescription}
        onSuccess={() => {
          void refetchPartition();
          setIsEditDescriptionModalOpen(false);
        }}
        onCancel={handleCloseEditDescriptionModal}
      />
    </BaseLayout>
  );
}

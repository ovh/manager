import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { CardSection } from '@/components/CardSection';
import { StatusBadge } from '@/components/StatusBadge';
import { ApiAvailableBadge } from '@/components/ApiAvailableBadge';
import { CommonCard } from '@/components/CommonCard';

type TStorageManagementCardProps = {
  isLocalZone: boolean;
  isRightOffer: boolean;
  showReplicationBanner: boolean;
  manageReplicationsHref: string;
};

export const StorageManagementCard = ({
  isLocalZone,
  isRightOffer,
  showReplicationBanner,
  manageReplicationsHref,
}: TStorageManagementCardProps) => {
  const { t } = useTranslation([
    'container',
    'dashboard',
    'containers/enable-versioning',
  ]);

  const renderReplicationSection = () => {
    if (!isRightOffer || isLocalZone) return null;

    return (
      <CardSection
        title={t(
          'dashboard:pci_projects_project_storages_dashboard_async_replication',
        )}
      >
        <div>
          <StatusBadge
            status={showReplicationBanner ? 'disabled' : 'enabled'}
            translationKey="container:pci_projects_project_storages_containers_container_offsite_replication"
            color={!showReplicationBanner ? 'success' : 'warning'}
            isStorageCard={true}
          />
        </div>
        <div className="flex mt-4">
          <Links
            label={t(
              'containers/enable-versioning:pci_projects_project_storages_containers_manage_replications',
            )}
            type={LinkType.next}
            href={manageReplicationsHref}
          />
        </div>
      </CardSection>
    );
  };

  return (
    <CommonCard
      title={t(
        'dashboard:pci_projects_project_storages_dashboard_storage_management',
      )}
    >
      {renderReplicationSection()}

      <CardSection
        title={t('dashboard:pci_projects_project_storages_dashboard_lifecycle')}
        showDivider={false}
      >
        <ApiAvailableBadge className="mt-4" />
      </CardSection>
    </CommonCard>
  );
};

import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { STATUS_DISABLED, STATUS_ENABLED, STATUS_SUSPENDED } from '@/constants';
import { trackAction } from './Dashboard.page';
import { TRegion } from '@/api/data/region';
import { TServerContainer } from '@/api/data/container';
import { TOdsBadgeColor } from '@/components/types';
import { CardSection } from '@/components/CardSection';
import { StatusBadge } from '@/components/StatusBadge';
import { ApiAvailableBadge } from '@/components/ApiAvailableBadge';
import { CommonCard } from '@/components/CommonCard';

export type TContainer = {
  id: string;
  objectsCount: number;
  usedSpace: string | number;
  publicUrl: string;
  s3StorageType: string;
  staticUrl: string;
  regionDetails?: TRegion;
  tags?: TTags;
} & TServerContainer;

export type TTags = {
  [key: string]: string;
};

type TBucketPropertiesCardProps = {
  container: TContainer;
  isLocalZone: boolean;
  isRightOffer: boolean;
  getVersioningBadgeColor: TOdsBadgeColor;
  getObjectLockBadgeColor: TOdsBadgeColor;
  enableVersioningHref: string;
  trackClick: (action: any) => void;
};

export const BucketPropertiesCard = ({
  container,
  isLocalZone,
  isRightOffer,
  getVersioningBadgeColor,
  getObjectLockBadgeColor,
  enableVersioningHref,
  trackClick,
}: TBucketPropertiesCardProps) => {
  const { t } = useTranslation(['dashboard', 'containers/enable-versioning']);

  const renderObjectLockSection = () => (
    <CardSection
      title={t('dashboard:pci_projects_project_storages_dashboard_object_lock')}
    >
      {container?.objectLock?.status === STATUS_ENABLED ? (
        <>
          <div>
            <StatusBadge
              status={container.objectLock.status}
              translationKey="containers/enable-versioning:pci_projects_project_storages_containers_update_versioning"
              color={getObjectLockBadgeColor}
            />
          </div>
          <div className="mt-4">
            {container?.objectLock?.rule?.mode === 'compliance'
              ? t(
                  'dashboard:pci_projects_project_storages_dashboard_object_lock_compliance',
                )
              : t(
                  'dashboard:pci_projects_project_storages_dashboard_object_lock_governance',
                )}
          </div>
        </>
      ) : (
        <StatusBadge
          status={container.objectLock.status}
          translationKey="containers/enable-versioning:pci_projects_project_storages_containers_update_versioning"
          color={getObjectLockBadgeColor}
        />
      )}
      <ApiAvailableBadge className="mt-4" />
    </CardSection>
  );

  const renderVersioningSection = () => (
    <CardSection
      title={t('dashboard:pci_projects_project_storages_dashboard_versioning')}
    >
      <StatusBadge
        status={container.versioning.status}
        translationKey="containers/enable-versioning:pci_projects_project_storages_containers_update_versioning"
        color={getVersioningBadgeColor}
      />
      {(container.versioning?.status === STATUS_SUSPENDED ||
        container.versioning?.status === STATUS_DISABLED) && (
        <div className="flex mt-4">
          <Links
            label={t(
              'containers/enable-versioning:pci_projects_project_storages_containers_update_versioning_title',
            )}
            type={LinkType.next}
            href={enableVersioningHref}
            onClickReturn={() => {
              trackClick(
                trackAction({
                  actionType: 'page',
                  specificAction: 'object_activate_versioning',
                }),
              );
            }}
          />
        </div>
      )}
    </CardSection>
  );

  const renderApiOnlySection = (title: string) => (
    <CardSection title={title} showDivider={false}>
      <ApiAvailableBadge className="mt-4" />
    </CardSection>
  );

  return (
    <CommonCard
      title={t(
        'dashboard:pci_projects_project_storages_dashboard_bucket_properties',
      )}
      className="w-1/3"
    >
      {renderObjectLockSection()}

      {isRightOffer && !isLocalZone ? (
        <>
          {renderVersioningSection()}
          {renderApiOnlySection(
            t('dashboard:pci_projects_project_storages_dashboard_tags'),
          )}
          {renderApiOnlySection(
            t('dashboard:pci_projects_project_storages_dashboard_access_log'),
          )}
          {renderApiOnlySection(
            t(
              'dashboard:pci_projects_project_storages_dashboard_hosting_static_website',
            ),
          )}
        </>
      ) : (
        renderApiOnlySection(
          t('dashboard:pci_projects_project_storages_dashboard_versioning'),
        )
      )}
    </CommonCard>
  );
};

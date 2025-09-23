import { OdsBadge } from '@ovhcloud/ods-components/react';
import { Clipboard } from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { ObjectContainerMode } from '@/constants';
import { TContainer } from './BucketPropertiesCard';
import { TOdsBadgeColor } from '@/components/types';
import { CardSection } from '@/components/CardSection';
import { CommonCard } from '@/components/CommonCard';

type TContainerInfoCardProps = {
  container: TContainer;
  isS3StorageType: boolean;
  isLocalZone: boolean;
};

type BadgeConfig = {
  className: string;
  label: string;
  color?: TOdsBadgeColor;
};

export const ContainerInfoCard = ({
  container,
  isS3StorageType,
  isLocalZone,
}: TContainerInfoCardProps) => {
  const { t } = useTranslation(['container', 'containers/add', 'dashboard']);

  const renderDeploymentModeBadge = () => {
    if (!container?.regionDetails?.type) return null;

    const badgeConfig: Record<string, BadgeConfig> = {
      [ObjectContainerMode.MULTI_ZONES]: {
        className: 'chip-3AZ ml-4',
        label: t(
          'containers/add:pci_projects_project_storages_containers_add_deployment_mode_region-3-az_label',
        ),
      },
      [ObjectContainerMode.MONO_ZONE]: {
        className: 'chip-1AZ ml-4',
        label: t(
          'containers/add:pci_projects_project_storages_containers_add_deployment_mode_region_label',
        ),
      },
      [ObjectContainerMode.LOCAL_ZONE]: {
        className: 'ml-4',
        color: 'information' as TOdsBadgeColor,
        label: t(
          'containers/add:pci_projects_project_storages_containers_add_deployment_mode_localzone_label',
        ),
      },
    };

    const config = badgeConfig[container.regionDetails.type];

    return (
      <OdsBadge
        className={config.className}
        size="md"
        color={config.color || 'neutral'}
        label={config.label}
      />
    );
  };

  return (
    <CommonCard
      title={t(
        'dashboard:pci_projects_project_storages_dashboard_informations',
      )}
      className="w-1/3"
    >
      <CardSection
        title={
          isS3StorageType
            ? t(
                'dashboard:pci_projects_project_storages_dashboard_container_name',
              )
            : t(
                'container:pci_projects_project_storages_containers_container_info_id',
              )
        }
      >
        <Clipboard
          value={container?.id || container?.name}
          className="w-full"
        />
      </CardSection>

      <CardSection
        title={t(
          'dashboard:pci_projects_project_storages_dashboard_container_localisation',
        )}
      >
        <div className="w-full flex items-center text-[#4d5592]">
          {container?.region}
          {renderDeploymentModeBadge()}
        </div>
      </CardSection>

      {!isLocalZone && (
        <>
          <CardSection
            title={t(
              'dashboard:pci_projects_project_storages_dashboard_container_objects_number',
            )}
          >
            {container?.objectsCount}
          </CardSection>

          <CardSection
            title={t(
              'dashboard:pci_projects_project_storages_dashboard_container_used_space',
            )}
          >
            {container?.usedSpace}
          </CardSection>
        </>
      )}

      <CardSection
        title={t(
          'dashboard:pci_projects_project_storages_dashboard_container_Endpoint',
        )}
      >
        <Clipboard value={container?.publicUrl} className="w-full" />
      </CardSection>

      <CardSection
        title={
          isS3StorageType
            ? t(
                'dashboard:pci_projects_project_storages_dashboard_container_virtual_hosted_style',
              )
            : t('dashboard:pci_projects_project_storages_dashboard_cname')
        }
        showDivider={false}
      >
        <Clipboard
          value={container?.staticUrl || container?.virtualHost}
          className="w-full"
        />
      </CardSection>
    </CommonCard>
  );
};

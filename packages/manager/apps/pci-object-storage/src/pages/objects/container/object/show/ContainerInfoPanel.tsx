import {
  OdsText,
  OdsIcon,
  OdsBadge,
  OdsFormField,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import { Links, LinkType, Clipboard } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TFunction } from 'i18next';
import { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';
import LabelComponent from '@/components/Label.component';
import {
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_S3_STATIC_URL_INFO,
  STATUS_ENABLED,
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  MUMBAI_REGION_NAME,
  TRACKING,
} from '@/constants';
import { TContainer } from './Show.page';

interface ContainerInfoItemProps {
  translationKey?: string;
  translationValues?: Record<string, string | number>;
  children?: React.ReactNode;
  className?: string;
  t?: TFunction;
}

const ContainerInfoItem = ({
  translationKey,
  translationValues,
  children,
  className = '',
  t,
}: ContainerInfoItemProps) => {
  let content = children;

  if (translationKey && t) {
    content = (
      <Trans
        i18nKey={translationKey}
        values={translationValues}
        components={{
          strong: <strong />,
        }}
      />
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <OdsText>{content}</OdsText>
    </div>
  );
};

interface ContainerInfoPanelProps {
  container: TContainer;
  isLocalZone: boolean;
  isRightOffer: boolean;
  isEncrypted: boolean;
  displayEncryptionData: boolean;
  isReplicationRulesBannerShown: boolean;
  region?: {
    name?: string;
  };
  enableEncryptionHref: string;
  enableVersioningHref: string;
  tracking?: {
    trackClick: (params: { name: string; type: string }) => void;
  };
  trackClick: ({
    location,
    buttonType,
    actions,
    actionType,
  }: TrackingClickParams) => void;

  trackAction: (
    actionType: 'page' | 'funnel',
    specificAction: string,
  ) => {
    actions: string[];
  };
}

export function ContainerInfoPanel({
  container,
  isLocalZone,
  isRightOffer,
  isEncrypted,
  displayEncryptionData,
  isReplicationRulesBannerShown,
  region,
  enableEncryptionHref,
  enableVersioningHref,
  tracking,
  trackClick,
  trackAction,
}: ContainerInfoPanelProps) {
  const { t } = useTranslation([
    'container',
    'containers/enable-versioning',
    'containers/data-encryption',
  ]);

  const getVersioningBadgeColor = useMemo(() => {
    const statusMap = {
      [STATUS_ENABLED]: 'success',
      [STATUS_DISABLED]: 'critical',
      [STATUS_SUSPENDED]: 'warning',
    };

    return statusMap[container.versioning?.status] ?? 'information';
  }, [container.versioning?.status]);

  const showEnableEncryptionLink = useMemo(() => {
    return (
      isRightOffer &&
      !isLocalZone &&
      !isEncrypted &&
      region?.name !== MUMBAI_REGION_NAME
    );
  }, [isRightOffer, isLocalZone, isEncrypted, region?.name]);

  return (
    <div className="grid grid-cols-12 gap-4 border border-solid border-[#bef1ff] bg-[#f5feff] rounded-md mt-6 py-8 px-12">
      <div className="grid gap-2 col-span-12 md:col-span-4">
        <ContainerInfoItem
          translationKey="container:pci_projects_project_storages_containers_container_region"
          translationValues={{
            region: container?.region,
          }}
          t={t}
        />

        {!isLocalZone && (
          <>
            <ContainerInfoItem
              translationKey="container:pci_projects_project_storages_containers_container_object_info_storedObjects"
              translationValues={{
                objects: container?.objectsCount,
              }}
              t={t}
            />
            <ContainerInfoItem
              translationKey="container:pci_projects_project_storages_containers_container_info_storedBytes"
              translationValues={{
                bytes: container?.usedSpace,
              }}
              t={t}
            />
          </>
        )}

        {displayEncryptionData && !isEncrypted && !isLocalZone && (
          <ContainerInfoItem>
            <OdsText>
              <Trans
                t={t}
                i18nKey="container:pci_projects_project_storages_containers_container_info_data_encryption_disabled"
                components={{
                  strong: <strong />,
                }}
              />
            </OdsText>
            {showEnableEncryptionLink && (
              <div>
                <Links
                  label={t(
                    'container:pci_projects_project_storages_containers_container_enable_encryption',
                  )}
                  type={LinkType.next}
                  href={enableEncryptionHref}
                />
              </div>
            )}
          </ContainerInfoItem>
        )}

        {displayEncryptionData && isEncrypted && (
          <ContainerInfoItem>
            <div className="flex items-center">
              <Trans
                t={t}
                i18nKey="container:pci_projects_project_storages_containers_container_info_data_encryption_enabled"
                components={{
                  strong: <strong />,
                }}
              />
              <OdsIcon
                id="aesPopoverTrigger"
                name="circle-question"
                className="ml-4"
                onClick={() => {
                  const name = TRACKING.STORAGE_ENCRYPTION.TOOLTIP_AES256;
                  if (name) {
                    tracking?.trackClick({
                      name,
                      type: 'action',
                    });
                  }
                }}
              />
              <OdsPopover triggerId="aesPopoverTrigger">
                <OdsText>
                  {t(
                    'containers/data-encryption:pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
                  )}
                </OdsText>
              </OdsPopover>
            </div>
          </ContainerInfoItem>
        )}

        {isRightOffer && !isLocalZone && (
          <>
            <div className="flex gap-4">
              <OdsText>
                {t(
                  'containers/enable-versioning:pci_projects_project_storages_containers_update_versioning_versioning',
                )}
              </OdsText>
              <OdsBadge
                size="sm"
                label={t(
                  `containers/enable-versioning:pci_projects_project_storages_containers_update_versioning_${container.versioning.status}_label`,
                )}
                color={getVersioningBadgeColor}
              />
            </div>

            {(container.versioning?.status === STATUS_SUSPENDED ||
              container.versioning?.status === STATUS_DISABLED) && (
              <Links
                label={t(
                  'containers/enable-versioning:pci_projects_project_storages_containers_update_versioning_title',
                )}
                type={LinkType.next}
                href={enableVersioningHref}
                onClickReturn={() => {
                  trackClick(trackAction('page', 'object_activate_versioning'));
                }}
              />
            )}
          </>
        )}

        {isRightOffer &&
          !isLocalZone &&
          container.regionDetails?.type ===
            OBJECT_CONTAINER_MODE_MULTI_ZONES && (
            <ContainerInfoItem className="flex gap-4 mb-4 mt-4">
              <OdsText>
                {t(
                  'container:pci_projects_project_storages_containers_container_offsite_replication_title',
                )}
              </OdsText>
              <OdsBadge
                className="ml-4"
                size="sm"
                label={t(
                  `container:pci_projects_project_storages_containers_container_offsite_replication_${
                    isReplicationRulesBannerShown ? 'disabled' : 'enabled'
                  }`,
                )}
                color={!isReplicationRulesBannerShown ? 'success' : 'critical'}
              />
              <span className="ml-4">
                <OdsIcon
                  id="trigger-popover"
                  name="circle-question"
                  className="text-[var(--ods-color-information-500)]"
                />
                <OdsPopover triggerId="trigger-popover">
                  <OdsText preset="caption">
                    {t(
                      'container:pci_projects_project_storages_containers_container_offsite_replication_tooltip',
                    )}
                  </OdsText>
                </OdsPopover>
              </span>
            </ContainerInfoItem>
          )}
      </div>

      <div className="grid col-span-12 md:col-span-8 gap-4">
        <OdsFormField>
          <LabelComponent
            text={t(
              'container:pci_projects_project_storages_containers_container_info_id',
            )}
          />
          <Clipboard
            className="w-full"
            value={container?.id || container?.name}
          />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            triggerId="public-url-popover"
            text={t(
              'container:pci_projects_project_storages_containers_container_info_publicUrl',
            )}
            helpText={t(
              'container:pci_projects_project_storages_containers_container_info_publicUrl_help',
            )}
          />
          <Clipboard className="w-full" value={container?.publicUrl} />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            triggerId="virtual-host-popover"
            text={
              container.s3StorageType
                ? OBJECT_CONTAINER_S3_STATIC_URL_INFO
                : t(
                    'pci_projects_project_storages_containers_container_object_info_staticUrl',
                  )
            }
            helpText={t(
              `container:pci_projects_project_storages_containers_container_object_info_${
                container.s3StorageType ? 's3_staticUrl_help' : 'staticUrl_help'
              }`,
            )}
          />
          <Clipboard
            className="w-full"
            value={container?.staticUrl || container?.virtualHost}
          />
        </OdsFormField>
      </div>
    </div>
  );
}

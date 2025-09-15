import {
  Suspense,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useContext,
} from 'react';
import { Outlet, useHref, useParams, useSearchParams } from 'react-router-dom';
import {
  BaseLayout,
  Links,
  LinkType,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useNotifications,
  useProductMaintenance,
  useProjectUrl,
  useMe,
} from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { TabsPanel, useProject } from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsText,
  OdsLink,
  OdsMessage,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  STATUS_ENABLED,
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  STORAGE_ASYNC_REPLICATION_LINK,
  STORAGE_LOCALISATION_LINKS,
  STORAGE_OBJECT_LOCK_LINKS,
  STORAGE_VERSIONING_LINKS,
  STORAGE_ACCESS_LOGS_LINKS,
  STORAGE_STATIC_WEBSITE_LINKS,
  UNIVERSE,
  SUB_UNIVERSE,
  APP_NAME,
} from '@/constants';
import { useContainerData } from '@/hooks/useContainerData';
import { ContainerInfoCard } from './ContainerInfoCard';
import { BucketPropertiesCard } from './BucketPropertiesCard';
import { StorageManagementCard } from './StorageManagementCard';
import { SecurityPermissionsCard } from './SecurityPermissionsCard';
import { HelpDrawer } from './HelpDrawer';
import { getStatusColor, TStatusColor } from '@/utils/getStatusColor';
import { getDashboardTabs } from '@/utils/getDashboardTabs';
import { CommonCard } from '@/components/CommonCard';

const statusMap: Record<string, TStatusColor> = {
  [STATUS_ENABLED]: 'success',
  [STATUS_DISABLED]: 'warning',
  [STATUS_SUSPENDED]: 'warning',
};

export type TTTrackActionParams = {
  actionType: 'page' | 'funnel';
  specificAction: string;
};

export const trackAction = ({
  actionType,
  specificAction,
}: TTTrackActionParams) => {
  const additionalActions =
    actionType === 'page'
      ? ['page', 'button', specificAction]
      : ['funnel', 'tile-tutorial', specificAction];

  return {
    actions: [UNIVERSE, SUB_UNIVERSE, APP_NAME, ...additionalActions],
  };
};

export default function DashboardPage() {
  const { storageId, projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();
  const { trackClick } = useOvhTracking();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { t, i18n } = useTranslation([
    'objects',
    'container',
    'pci-common',
    'containers/add',
    'dashboard',
    'containers/enable-versioning',
    NAMESPACES.FORM,
  ]);

  const {
    container,
    url,
    region,
    isEncrypted,
    showReplicationBanner,
    showEnableEncryptionLink,
    displayEncryptionData,
    isPending,
    isLocalZone,
    isRightOffer,
  } = useContainerData();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );
  const context = useContext(ShellContext);

  const { me } = useMe();
  const { clearNotifications } = useNotifications();

  const regionName = useMemo(() => searchParams.get('region'), [searchParams]);
  const hrefProject = useProjectUrl('public-cloud');
  const objectStorageHref = useHref('..');

  const manageReplicationsHref = useHref(
    `/pci/projects/${projectId}/storages/objects/${storageId}/replications?region=${regionName}`,
  );
  const enableVersioningHref = useHref(
    `./enableVersioning?region=${regionName}`,
  );
  const enableEncryptionHref = useHref(
    `./enableEncryption?region=${regionName}`,
  );

  const { ovhSubsidiary } = context.environment.getUser();

  const REPLICATION_LINK = STORAGE_ASYNC_REPLICATION_LINK[ovhSubsidiary];

  const LOCALISATION_LINK = STORAGE_LOCALISATION_LINKS[ovhSubsidiary];

  const OBJECT_LOCK_LINK = STORAGE_OBJECT_LOCK_LINKS[ovhSubsidiary];

  const VERSIONING_LINK = STORAGE_VERSIONING_LINKS[ovhSubsidiary];

  const ACCESS_LOGS_LINK = STORAGE_ACCESS_LOGS_LINKS[ovhSubsidiary];

  const STATIC_WEBSITE_LINK = STORAGE_STATIC_WEBSITE_LINKS[ovhSubsidiary];

  const versioningBadgeColor = getStatusColor(
    container?.versioning?.status,
    statusMap,
  );

  const objectLockBadgeColor = useMemo(
    () => getStatusColor(container?.objectLock?.status, statusMap),
    [container?.objectLock?.status],
  );

  const tabs = useMemo(
    () =>
      getDashboardTabs({
        projectId: project?.project_id,
        storageId,
        region: region?.name,
        t,
      }),
    [project?.project_id, storageId, region?.name, t],
  );

  const onGuidesClick = useCallback(() => {
    trackClick(
      trackAction({ actionType: 'funnel', specificAction: 'go-to-tutorial' }),
    );
  }, [trackClick]);

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  if (!container || !url || isPending) {
    return <OdsSpinner size="md" />;
  }

  const getStorageHelpDrawerMode = () => {
    if (!isRightOffer) return 'swift';
    if (isLocalZone) return 'local-zone';
    return 's3-standard';
  };

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            href={objectStorageHref}
            label={t(
              'objects:pci_projects_project_storages_containers_object_title',
            )}
          />
          <OdsBreadcrumbItem href="" label={container?.name} />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,
        headerButton: (
          <span onClick={onGuidesClick}>
            <PciGuidesHeader category="objectStorage" />
          </span>
        ),
      }}
      tabs={<TabsPanel tabs={tabs} />}
      backLinkLabel={`${t('pci-common:common_back_button_back_to')} ${t(
        'container:pci_projects_project_storages_containers_container_back_button_label',
      )}`}
      hrefPrevious={objectStorageHref}
    >
      <Notifications />

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      {showReplicationBanner && (
        <OdsMessage
          color="information"
          className="mb-6 inline-flex items-start"
          isDismissible={false}
        >
          <span>
            <Trans
              i18nKey={
                'container:pci_projects_project_storages_containers_container_add_replication_rules_info'
              }
              components={{
                1: <Links href={manageReplicationsHref} />,
                2: (
                  <Links
                    href={REPLICATION_LINK}
                    target="_blank"
                    type={LinkType.external}
                  />
                ),
              }}
            />
          </span>
        </OdsMessage>
      )}

      <div className="flex flex-row w-full gap-4">
        <ContainerInfoCard
          container={container}
          isRightOffer={isRightOffer}
          isLocalZone={isLocalZone}
        />

        {isRightOffer && (
          <BucketPropertiesCard
            container={container}
            isLocalZone={isLocalZone}
            isRightOffer
            getVersioningBadgeColor={versioningBadgeColor}
            getObjectLockBadgeColor={objectLockBadgeColor}
            enableVersioningHref={enableVersioningHref}
            trackClick={trackClick}
          />
        )}

        <div className="flex flex-col w-1/3 gap-4">
          {isRightOffer && (
            <StorageManagementCard
              isLocalZone={isLocalZone}
              isRightOffer
              showReplicationBanner={showReplicationBanner}
              manageReplicationsHref={manageReplicationsHref}
            />
          )}
          {!isLocalZone && isRightOffer && (
            <SecurityPermissionsCard
              displayEncryptionData={displayEncryptionData}
              isEncrypted={isEncrypted}
              showEnableEncryptionLink={showEnableEncryptionLink}
              enableEncryptionHref={enableEncryptionHref}
              isLocalZone={isLocalZone}
            />
          )}
          <CommonCard
            title={t(
              'dashboard:pci_projects_project_storages_dashboard_helper_drawer_title',
            )}
          >
            <div className="flex flex-col my-6 gap-4 ">
              <OdsText>
                {t(
                  'dashboard:pci_projects_project_storages_dashboard_helper_drawer_description',
                )}
              </OdsText>
              <OdsLink
                label={t(
                  'dashboard:pci_projects_project_storages_dashboard_helper_drawer_title',
                )}
                href={null}
                onClick={() => setIsDrawerOpen(true)}
                icon={ODS_ICON_NAME.arrowRight}
              />
            </div>
          </CommonCard>
        </div>
      </div>

      <Suspense fallback={null}>
        <Outlet />
      </Suspense>

      <HelpDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        storageMode={getStorageHelpDrawerMode()}
        customLinks={{
          asyncReplication: REPLICATION_LINK,
          localisation: LOCALISATION_LINK,
          objectLock: OBJECT_LOCK_LINK,
          versioning: VERSIONING_LINK,
          accessLogs: ACCESS_LOGS_LINK,
          staticWebsite: STATIC_WEBSITE_LINK,
        }}
      />
    </BaseLayout>
  );
}

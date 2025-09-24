import { Suspense, useContext, useMemo } from 'react';
import { Outlet, useHref, useParams, useSearchParams } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useProductMaintenance,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';

import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useServerContainer } from '@/api/hooks/useContainer';
import { useGetRegion } from '@/api/hooks/useRegion';
import {
  useAllServerStorages,
  useStorage,
  useStorageEndpoint,
} from '@/api/hooks/useStorages';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';
import { STORAGE_ASYNC_REPLICATION_LINK } from '@/constants';
import { useMergedContainer } from '@/hooks/useContainerMemo';
import { ManageReplicationForm } from './ManageReplicationPage.form';

export default function ManageReplicationPage() {
  const { storageId, projectId, replicationId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation(['objects', 'containers/replication']);

  const objectStorageHref = useHref('..');
  const containerDetailsHref = useHref(
    `../${storageId}?region=${searchParams.get('region')}`,
  );
  const manageReplicationsHref = useHref(
    `../${storageId}/replications?region=${searchParams.get('region')}`,
  );

  const { data: region } = useGetRegion(
    project?.project_id,
    searchParams.get('region'),
  );

  const { storage: targetContainer } = useStorage(
    project?.project_id,
    storageId,
    searchParams.get('region'),
  );

  const { url } = useStorageEndpoint(project?.project_id, targetContainer);

  const { is3azAvailable, isLocalZoneAvailable } = useStorageFeatures();
  const { allStorages } = useAllServerStorages(projectId, {
    isLocalZoneAvailable,
    is3azAvailable,
  });

  const { data: serverContainer, isLoading } = useServerContainer(
    project?.project_id,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
  );

  const container = useMergedContainer(
    serverContainer,
    targetContainer,
    url,
    region,
  );

  const replicationRuleIdParam =
    replicationId && decodeURIComponent(atob(replicationId));

  const isEditMode = !!replicationRuleIdParam;
  const existingRule = isEditMode
    ? container?.replication?.rules.find(
        (rule) => rule.id === replicationRuleIdParam,
      )
    : undefined;

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const asyncReplicationLink =
    STORAGE_ASYNC_REPLICATION_LINK[ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  const showManageReplications = useMemo(() => {
    return (container && !isEditMode) || (isEditMode && existingRule);
  }, [container, isEditMode, existingRule]);

  const isCurrentContainer = (storage) =>
    storage.name === container?.name && storage.region === container?.region;

  const filteredStorages = useMemo(() => {
    return allStorages.filter((storage) => !isCurrentContainer(storage));
  }, [allStorages, container]);

  if (
    !container ||
    !url ||
    isLoading ||
    (isEditMode && existingRule === undefined)
  ) {
    return <OdsSpinner size="md" />;
  }

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
          <OdsBreadcrumbItem
            href={containerDetailsHref}
            label={container.name}
          />
          <OdsBreadcrumbItem
            href={manageReplicationsHref}
            label={t(
              'containers/replication:pci_projects_project_storages_containers_replication_list_sub_title',
            )}
          />
          <OdsBreadcrumbItem
            href=""
            label={t(
              isEditMode
                ? 'containers/replication/add:pci_projects_project_storages_containers_replication_edit_replication_rule_sub_title'
                : 'containers/replication/add:pci_projects_project_storages_containers_replication_add_replication_rule_sub_title',
            )}
          />
        </OdsBreadcrumb>
      }
      header={{
        title: container.name,
        headerButton: <PciGuidesHeader category="objectStorage" />,
      }}
    >
      <Notifications />

      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}

      {showManageReplications && (
        <ManageReplicationForm
          container={container}
          region={region}
          filteredStorages={filteredStorages}
          existingRule={existingRule}
          isEditMode={isEditMode}
          replicationRuleIdParam={replicationRuleIdParam}
          storageId={storageId}
          searchParams={searchParams}
          projectId={projectId}
          asyncReplicationLink={asyncReplicationLink}
          project={project}
        />
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}

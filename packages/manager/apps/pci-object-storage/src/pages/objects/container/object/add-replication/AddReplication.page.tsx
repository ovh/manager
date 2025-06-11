import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Outlet,
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  PciGuidesHeader,
  PciMaintenanceBanner,
  useNotifications,
  useProductMaintenance,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';

import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsLink,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import {
  ODS_BUTTON_VARIANT,
  OdsInputChangeEvent,
} from '@ovhcloud/ods-components';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useServerContainer } from '@/api/hooks/useContainer';

import { useGetRegion } from '@/api/hooks/useRegion';
import {
  useAllServerStorages,
  useStorage,
  useStorageEndpoint,
  useUpdateStorage,
} from '@/api/hooks/useStorages';

import './style.scss';

import { ReplicationRuleId } from './ReplicationRuleName.component';
import { ReplicationRuleStatus } from './ReplicationRuleStatus.component';
import { ReplicationRulePrefix } from './ReplicationRulePrefix.component';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';
import {
  STATUS_DISABLED,
  STATUS_ENABLED,
  STORAGE_ASYNC_REPLICATION_LINK,
  ReplicationStorageClass,
} from '@/constants';
import { ReplicationRuleDeleteMarker } from './ReplicationRuleDeleteMarker.component';
import {
  ReplicationRuleDestination,
  TReplicationDestination,
} from './ReplicationRuleDestination.component';
import {
  DEFAULT_PRIORITY,
  MAX_PRIORITY,
  ReplicationRulePriority,
} from './ReplicationRulePriority.component';
import { ReplicationRuleStorageClass } from './ReplicationRuleStorageClass.component';
import { useContainerMemo } from '@/hooks/useContainerMemo';

const validIdRegex = /^[\x20-\x7E]{3,255}$/;
const validPrefixRegex = /^[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}](?:[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}]{0,255})?$/u;

export type TReplicationStatus = 'enabled' | 'disabled';

export type ReplicationStorage = {
  mode: string;
  offer: string;
  deploymentMode: string;
  containerCount: number;
  usedSpace: number;
  archive?: boolean;
  containerType?: 'private' | 'public' | 'static';
  id: string;
  name: string;

  state?: string;
};

export default function AddReplicationPage() {
  const { storageId } = useParams();

  const [searchParams] = useSearchParams();
  const { data: project } = useProject();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    project?.project_id,
  );

  const navigate = useNavigate();

  const hrefProject = useProjectUrl('public-cloud');

  const { t } = useTranslation([
    'objects',
    'containers/replication',
    'containers/replication/add',
  ]);

  const objectStorageHref = useHref('..');
  const containerDetailsHref = useHref(
    `../${storageId}?region=${searchParams.get('region')}`,
  );

  const managereplicationsHref = useHref(
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
  const { projectId } = useParams();

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

  const container = useContainerMemo(
    serverContainer,
    targetContainer,
    url,
    region,
  );

  const { clearNotifications, addSuccess, addError } = useNotifications();

  const isCurrentContainer = (storage) =>
    storage.name === container?.name && storage.region === container?.region;

  const filteredStorages = useMemo(() => {
    return allStorages.filter((storage) => !isCurrentContainer(storage));
  }, [allStorages, container]);

  const [replicationRuleId, setReplicationRuleId] = useState('');
  const [isReplicationRuleIdTouched, setIsReplicationRuleIdTouched] = useState(
    false,
  );

  const isValidReplicationRuleId = useMemo(() => {
    return validIdRegex.test(replicationRuleId);
  }, [replicationRuleId]);

  const [replicationStatus, setReplicationStatus] = useState<
    TReplicationStatus
  >(STATUS_ENABLED);

  const [replicationRulePrefix, setReplicationRulePrefix] = useState('');
  const [
    isReplicationRulePrefixTouched,
    setIsReplicationRulePrefixTouched,
  ] = useState(false);

  const [prefixError, setPrefixError] = useState<string | undefined>(undefined);
  const isValidReplicationRulePrefix = useMemo(() => {
    return validPrefixRegex.test(replicationRulePrefix);
  }, [replicationRulePrefix]);

  const [destination, setDestination] = useState<
    TReplicationDestination | undefined
  >(undefined);

  const [destinationDetails, setDestinationDetails] = useState<
    ReplicationStorage | undefined
  >(undefined);

  const [useStorageclass, setUseStorageclass] = useState<boolean>(false);
  const [storageClass, setStorageClass] = useState<
    ReplicationStorageClass | undefined
  >(ReplicationStorageClass.STANDARD);

  const [deleteMarkerReplication, setDeleteMarkerReplication] = useState<
    TReplicationStatus
  >(STATUS_DISABLED);

  const { data: serverDestinationContainer } = useServerContainer(
    project?.project_id,
    destination?.region,
    destination?.name,
    null,
  );

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const asyncReplicationLink =
    STORAGE_ASYNC_REPLICATION_LINK[ovhSubsidiary] ||
    STORAGE_ASYNC_REPLICATION_LINK.DEFAULT;

  const [priority, setPriority] = useState<number>(1);
  const [priorityError, setPriorityError] = useState<boolean | undefined>(
    undefined,
  );

  const handlePriorityChange = useCallback(
    (event: OdsInputChangeEvent) => {
      const newValue = Math.round(Number(event.detail.value));
      if (newValue >= DEFAULT_PRIORITY && newValue <= MAX_PRIORITY) {
        const isPriorityTaken = container?.replication?.rules.find((item) => {
          return (
            item.priority === newValue &&
            destination?.name === item.destination?.name
          );
        });

        if (isPriorityTaken) {
          setPriority(newValue);
          setPriorityError(true);

          return;
        }

        setPriorityError(false);
        setPriority(newValue);
      } else {
        setPriority(DEFAULT_PRIORITY);
      }
    },
    [container?.replication, setPriority, destination],
  );

  const handleDestinationChange = useCallback(
    (dest: TReplicationDestination) => {
      setDestination(dest);
      handlePriorityChange({ detail: { value: 1 } } as OdsInputChangeEvent);
      setStorageClass(ReplicationStorageClass.STANDARD);
    },
    [setDestination],
  );

  const isButtonActive = useMemo(() => {
    const hasValidPrefix =
      (isValidReplicationRulePrefix && replicationRulePrefix !== '') ||
      replicationRulePrefix === '';

    return (
      isValidReplicationRuleId &&
      hasValidPrefix &&
      destination?.name &&
      serverDestinationContainer?.versioning?.status === STATUS_ENABLED &&
      deleteMarkerReplication &&
      priority &&
      !priorityError
    );
  }, [
    isValidReplicationRuleId,
    isValidReplicationRulePrefix,
    replicationRulePrefix,
    destination?.name,
    serverDestinationContainer?.versioning?.status,
    deleteMarkerReplication,
    priority,
    priorityError,
  ]);

  const { updateContainer, isPending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: container?.s3StorageType,
    onError(error: ApiError) {
      clearNotifications();
      addError(
        <Translation ns="containers/replication/add">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_replication_add_error_message',
              {
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
    },
    onSuccess() {
      addSuccess(
        <Translation ns="containers/replication/add">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_replication_add_success_message',
            )
          }
        </Translation>,
        true,
      );
      navigate(
        `../${storageId}/replications?region=${searchParams.get('region')}`,
      );
    },
  });

  const onCreateReplicationRule = () => {
    if (!isButtonActive) return;

    const newReplicationRule = {
      id: replicationRuleId,
      status: replicationStatus,
      filter: {
        prefix: replicationRulePrefix || undefined,
      },
      destination: {
        name: destination.name,
        region: destination.region,
        storageClass: useStorageclass ? storageClass : undefined,
      },
      deleteMarkerReplication,
      priority,
    };

    updateContainer({
      replication: {
        rules: [...(container.replication?.rules || []), newReplicationRule],
      },
    });
  };

  useEffect(() => {
    clearNotifications();
  }, []);

  if (!container || !url) {
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
            href={managereplicationsHref}
            label={t(
              'containers/replication:pci_projects_project_storages_containers_replication_list_sub_title',
            )}
          />

          <OdsBreadcrumbItem
            href=""
            label={t(
              'containers/replication/add:pci_projects_project_storages_containers_replication_add_replication_rule_sub_title',
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

      {container && (
        <>
          {container?.s3StorageType &&
            (!isLoading ? (
              <div className="mt-9 sm:w-3/4">
                <OdsText preset="heading-4" className="mt-6 block">
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_replication_rule_sub_title',
                  )}
                </OdsText>
                <OdsText preset="paragraph" className="mt-8 block">
                  {t(
                    'containers/replication/add:pci_projects_project_storages_containers_replication_add_title_description',
                  )}
                  <OdsLink
                    className="ml-4"
                    color="primary"
                    href={asyncReplicationLink}
                    target="_blank"
                    label={t(
                      'containers/replication/add:pci_projects_project_storages_containers_replication_add_title_description_link',
                    )}
                    icon="external-link"
                  />
                </OdsText>

                <div className="mt-8 ">
                  <ReplicationRuleId
                    replicationRuleId={replicationRuleId}
                    setReplicationRuleId={setReplicationRuleId}
                    isReplicationRuleIdTouched={isReplicationRuleIdTouched}
                    setIsReplicationRuleIdTouched={
                      setIsReplicationRuleIdTouched
                    }
                    isValidReplicationRuleId={isValidReplicationRuleId}
                  />
                  <ReplicationRulePrefix
                    replicationRulePrefix={replicationRulePrefix}
                    setReplicationRulePrefix={setReplicationRulePrefix}
                    isReplicationRulePrefixTouched={
                      isReplicationRulePrefixTouched
                    }
                    setIsReplicationRulePrefixTouched={
                      setIsReplicationRulePrefixTouched
                    }
                    isValidReplicationRulePrefix={isValidReplicationRulePrefix}
                    prefixError={prefixError}
                    setPrefixError={setPrefixError}
                  />

                  <ReplicationRuleDeleteMarker
                    deleteMarkerReplication={deleteMarkerReplication}
                    setDeleteMarkerReplication={setDeleteMarkerReplication}
                    asyncReplicationLink={asyncReplicationLink}
                  />

                  <ReplicationRuleDestination
                    destination={destination}
                    setDestination={handleDestinationChange}
                    allStorages={filteredStorages}
                    setDestinationDetails={setDestinationDetails}
                    serverDestinationContainer={serverDestinationContainer}
                    asyncReplicationLink={asyncReplicationLink}
                    setUseStorageclass={setUseStorageclass}
                  />

                  <ReplicationRuleStorageClass
                    destinationName={destination?.name}
                    useStorageclass={useStorageclass}
                    setUseStorageclass={setUseStorageclass}
                    storageClass={storageClass}
                    setStorageClass={setStorageClass}
                    destinationDetailsMode={destinationDetails?.mode}
                  />
                  <ReplicationRulePriority
                    handlePriorityChange={handlePriorityChange}
                    priority={priority}
                    priorityError={priorityError}
                  />

                  <ReplicationRuleStatus
                    replicationStatus={replicationStatus}
                    setReplicationStatus={setReplicationStatus}
                  />
                </div>
                <div className="flex mt-[40px]">
                  <OdsButton
                    data-testid="cta-cancel-button"
                    label={t(
                      'containers/replication/add:pci_projects_project_storages_containers_replication_add_cancel',
                    )}
                    className="mr-4"
                    variant={ODS_BUTTON_VARIANT.outline}
                    onClick={() => {
                      navigate(
                        `../${storageId}/replications?region=${searchParams.get(
                          'region',
                        )}`,
                      );
                    }}
                  />

                  {isPending ? (
                    <div className="mt-4">
                      <OdsSpinner size="xs" />
                    </div>
                  ) : (
                    <OdsButton
                      data-testid="cta-plan-button"
                      label={t(
                        'containers/replication/add:pci_projects_project_storages_containers_replication_add_create',
                      )}
                      isDisabled={!isButtonActive}
                      onClick={onCreateReplicationRule}
                    />
                  )}
                </div>
              </div>
            ) : (
              <OdsSpinner />
            ))}
        </>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </BaseLayout>
  );
}

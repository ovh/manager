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
import { useMergedContainer } from '@/hooks/useContainerMemo';

import {
  ReplicationRuleTag,
  TDraftTags,
  TErrorMap,
  TIsTouched,
  TTagMap,
  TTagOrder,
} from './ReplicationRuleTag.component';

import { ReplicationRuleApplication } from './ReplicationRuleApplication.component';

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

  const container = useMergedContainer(
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

  const { replicationId } = useParams();
  const replicationRuleIdParam =
    replicationId && decodeURIComponent(atob(replicationId));

  const isEditMode = !!replicationRuleIdParam;
  const [isInitializing, setIsInitializing] = useState(isEditMode);

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
  const [replicationApplication, setReplicationApplication] = useState(true);

  const [replicationRulePrefix, setReplicationRulePrefix] = useState('');

  const isValidReplicationRulePrefix = useMemo(() => {
    return validPrefixRegex.test(replicationRulePrefix);
  }, [replicationRulePrefix]);

  const [
    isReplicationRulePrefixTouched,
    setIsReplicationRulePrefixTouched,
  ] = useState(false);

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
            destination?.name === item.destination?.name &&
            item.id !== replicationRuleIdParam
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
    [container?.replication, setPriority, destination, replicationRuleIdParam],
  );

  const handleDestinationChange = useCallback(
    (dest: TReplicationDestination) => {
      setDestination(dest);
      handlePriorityChange({ detail: { value: 1 } } as OdsInputChangeEvent);
      setStorageClass(ReplicationStorageClass.STANDARD);
    },
    [setDestination],
  );

  const [replicationRuleTags, setReplicationRuleTags] = useState<TTagMap>({});
  const [draftTags, setDraftTags] = useState<TDraftTags>({});
  const [keyErrors, setKeyErrors] = useState<TErrorMap>({});
  const [valueErrors, setValueErrors] = useState<TErrorMap>({});
  const [isTouched, setIsTouched] = useState<TIsTouched>({});
  const [tagOrder, setTagOrder] = useState<TTagOrder>([]);

  const areAllValuesUndefined = (obj) => {
    if (Object.keys(obj).length === 0) {
      return true;
    }

    return Object.values(obj).every((value) => value === undefined);
  };

  const existingRule = useMemo(() => {
    if (!isEditMode || !container?.replication?.rules) return undefined;
    return container.replication.rules.find(
      (rule) => rule.id === replicationRuleIdParam,
    );
  }, [isEditMode, container, replicationRuleIdParam]);

  useEffect(() => {
    handlePriorityChange({ detail: { value: 1 } } as OdsInputChangeEvent);
    if (isEditMode && existingRule) {
      setPriority(existingRule.priority);
      handlePriorityChange({
        detail: { value: existingRule.priority },
      } as OdsInputChangeEvent);

      setUseStorageclass(!!existingRule.destination?.storageClass);
      setStorageClass(
        existingRule.destination?.storageClass ||
          ReplicationStorageClass.STANDARD,
      );
    }
  }, [destination]);

  useEffect(() => {
    if (isEditMode && existingRule) {
      setReplicationRuleId(existingRule.id);
      setReplicationStatus(existingRule.status);
      setReplicationRulePrefix(existingRule.filter?.prefix || '');
      setDestination(
        existingRule.destination
          ? {
              name: existingRule.destination.name,
              region: existingRule.destination.region,
              storageClass: existingRule.destination.storageClass,
            }
          : undefined,
      );
      setUseStorageclass(!!existingRule.destination?.storageClass);
      setStorageClass(
        existingRule.destination?.storageClass ||
          ReplicationStorageClass.STANDARD,
      );
      setDeleteMarkerReplication(
        existingRule.deleteMarkerReplication || STATUS_DISABLED,
      );
      setPriority(existingRule.priority || 1);

      const tags = existingRule.filter?.tags || {};
      setReplicationRuleTags(tags);
      setTagOrder(Object.keys(tags));

      const initialDraftTags = Object.keys(tags).reduce((acc, key) => {
        acc[key] = { key, value: tags[key] };
        return acc;
      }, {});
      setDraftTags(initialDraftTags);

      setIsInitializing(false);

      if (!existingRule.filter) {
        setReplicationApplication(false);
      }
    } else if (!isEditMode) {
      setIsInitializing(false);
    }
  }, [isEditMode, existingRule]);

  const isButtonActive = useMemo(() => {
    const hasValidPrefix =
      (isValidReplicationRulePrefix && replicationRulePrefix !== '') ||
      replicationRulePrefix === '';

    const isReplicationApplicationMode =
      !replicationApplication ||
      (replicationApplication &&
        ((isValidReplicationRulePrefix && replicationRulePrefix !== '') ||
          Object.keys(replicationRuleTags).length > 0));

    return (
      isValidReplicationRuleId &&
      hasValidPrefix &&
      isReplicationApplicationMode &&
      destination?.name &&
      serverDestinationContainer?.versioning?.status === STATUS_ENABLED &&
      deleteMarkerReplication &&
      priority &&
      !priorityError &&
      areAllValuesUndefined(keyErrors) &&
      areAllValuesUndefined(valueErrors)
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
    keyErrors,
    valueErrors,
    replicationApplication,
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
              isEditMode
                ? 'pci_projects_project_storages_containers_replication_edit_error_message'
                : 'pci_projects_project_storages_containers_replication_add_error_message',
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
              isEditMode
                ? 'pci_projects_project_storages_containers_replication_edit_success_message'
                : 'pci_projects_project_storages_containers_replication_add_success_message',
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

    const filteredTags = Object.fromEntries(
      Object.entries(replicationRuleTags).filter(([key]) => key.trim() !== ''),
    );

    const newReplicationRule = {
      id: replicationRuleId,
      status: replicationStatus,
      ...(replicationApplication && {
        filter: {
          prefix: replicationRulePrefix || undefined,
          tags: Object.keys(filteredTags).length > 0 ? filteredTags : undefined,
        },
      }),
      destination: {
        name: destination.name,
        region: destination.region,
        storageClass: useStorageclass ? storageClass : undefined,
      },
      deleteMarkerReplication,
      priority,
    };

    const updatedRules = isEditMode
      ? container.replication.rules.map((rule) =>
          rule.id === replicationRuleIdParam ? newReplicationRule : rule,
        )
      : [...(container.replication?.rules || []), newReplicationRule];

    updateContainer({
      replication: {
        rules: updatedRules,
      },
    });
  };

  useEffect(() => {
    clearNotifications();
  }, []);

  if (
    !container ||
    !url ||
    isLoading ||
    isInitializing ||
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

      {((container && !isEditMode) ||
        (isEditMode && existingRule && !isInitializing)) && (
        <>
          {container?.s3StorageType &&
            (!isLoading ? (
              <div className="sm:w-3/4">
                <OdsText preset="heading-3" className=" block">
                  {t(
                    isEditMode
                      ? 'containers/replication/add:pci_projects_project_storages_containers_replication_edit_replication_rule_sub_title'
                      : 'containers/replication/add:pci_projects_project_storages_containers_replication_add_replication_rule_sub_title',
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

                  <ReplicationRuleApplication
                    replicationApplication={replicationApplication}
                    setReplicationApplication={setReplicationApplication}
                    setDeleteMarkerReplication={setDeleteMarkerReplication}
                    replicationRuleTags={replicationRuleTags}
                  />

                  {replicationApplication && (
                    <>
                      <ReplicationRulePrefix
                        setIsReplicationRulePrefixTouched={
                          setIsReplicationRulePrefixTouched
                        }
                        replicationRulePrefix={replicationRulePrefix}
                        setReplicationRulePrefix={setReplicationRulePrefix}
                        prefixError={
                          isReplicationRulePrefixTouched &&
                          !isValidReplicationRulePrefix &&
                          replicationRulePrefix !== ''
                            ? t('pci-common:common_field_error_pattern')
                            : undefined
                        }
                      />

                      <ReplicationRuleTag
                        replicationRuleTags={replicationRuleTags}
                        setReplicationRuleTags={setReplicationRuleTags}
                        draftTags={draftTags}
                        setDraftTags={setDraftTags}
                        keyErrors={keyErrors}
                        setKeyErrors={setKeyErrors}
                        valueErrors={valueErrors}
                        setValueErrors={setValueErrors}
                        isTouched={isTouched}
                        setIsTouched={setIsTouched}
                        deleteMarkerReplication={deleteMarkerReplication}
                        tagOrder={tagOrder}
                        setTagOrder={setTagOrder}
                        isEditMode={isEditMode}
                      />
                    </>
                  )}

                  <ReplicationRuleDeleteMarker
                    deleteMarkerReplication={deleteMarkerReplication}
                    setDeleteMarkerReplication={setDeleteMarkerReplication}
                    asyncReplicationLink={asyncReplicationLink}
                    replicationRuleTags={replicationRuleTags}
                    replicationApplication={replicationApplication}
                  />

                  <ReplicationRuleDestination
                    destination={destination}
                    setDestination={handleDestinationChange}
                    allStorages={filteredStorages}
                    setDestinationDetails={setDestinationDetails}
                    serverDestinationContainer={serverDestinationContainer}
                    asyncReplicationLink={asyncReplicationLink}
                    setUseStorageclass={setUseStorageclass}
                    container={container}
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
                        isEditMode
                          ? 'containers/replication/add:pci_projects_project_storages_containers_replication_add_update'
                          : 'containers/replication/add:pci_projects_project_storages_containers_replication_add_create',
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

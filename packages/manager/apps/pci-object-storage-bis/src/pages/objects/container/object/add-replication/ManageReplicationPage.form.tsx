import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation, Translation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsButton,
  OdsLink,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  OdsInputChangeEvent,
} from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { TProject } from '@ovh-ux/manager-pci-common';
import { TReplicationRule, useUpdateStorage } from '@/api/hooks/useStorages';
import { useServerContainer } from '@/api/hooks/useContainer';
import { useGetRegion } from '@/api/hooks/useRegion';
import { ReplicationRuleId } from './ReplicationRuleName.component';
import { ReplicationRuleStatus } from './ReplicationRuleStatus.component';
import { ReplicationRulePrefix } from './ReplicationRulePrefix.component';
import {
  STATUS_DISABLED,
  STATUS_ENABLED,
  ReplicationStorageClass,
} from '@/constants';
import { ReplicationRuleDeleteMarker } from './ReplicationRuleDeleteMarker.component';
import {
  ReplicationRuleDestination,
  TReplicationDestination,
  TReplicationStorage,
} from './ReplicationRuleDestination.component';
import {
  DEFAULT_PRIORITY,
  MAX_PRIORITY,
  ReplicationRulePriority,
} from './ReplicationRulePriority.component';
import { ReplicationRuleStorageClass } from './ReplicationRuleStorageClass.component';
import { ReplicationRuleApplication } from './ReplicationRuleApplication.component';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';
import { TRegion } from '@/api/data/region';
import { useSyncStorageClass } from '@/hooks/useSyncStorageClass';
import { ReplicationRuleTag, TTagMap } from './ReplicationRuleTag.component';
import {
  emptyTag,
  TTagValidationResult,
  TValidationErrors,
  validateAllTags,
} from '../../../../../utils/useTagValidation';

const validIdRegex = /^[\x20-\x7E]{3,255}$/;
const validPrefixRegex = /^[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}](?:[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}]{0,255})?$/u;

export type ContainerType = 'private' | 'public' | 'static';
export type TReplicationStatus = 'enabled' | 'disabled';

export type TManageReplicationForm = {
  container: TContainer;
  region: TRegion;
  filteredStorages: TReplicationStorage[];
  existingRule: TReplicationRule;
  isEditMode: boolean;
  replicationRuleIdParam: string;
  storageId: string;
  searchParams: URLSearchParams;
  projectId: string;
  asyncReplicationLink: string;
  project: TProject;
};

export function ManageReplicationForm({
  container,
  region,
  filteredStorages,
  existingRule,
  isEditMode,
  replicationRuleIdParam,
  storageId,
  searchParams,
  projectId,
  asyncReplicationLink,
  project,
}: TManageReplicationForm) {
  const { t } = useTranslation([
    'containers/replication',
    'containers/replication/add',
  ]);
  const { clearNotifications, addSuccess, addError } = useNotifications();

  const navigate = useNavigate();

  const shouldEditRule = isEditMode && existingRule;

  const [replicationRuleId, setReplicationRuleId] = useState(
    shouldEditRule ? existingRule.id : '',
  );
  const [isReplicationRuleIdTouched, setIsReplicationRuleIdTouched] = useState(
    false,
  );
  const isValidReplicationRuleId = useMemo(() => {
    return validIdRegex.test(replicationRuleId);
  }, [replicationRuleId]);
  const [replicationStatus, setReplicationStatus] = useState<
    TReplicationStatus
  >(shouldEditRule ? existingRule.status : STATUS_ENABLED);
  const [
    isReplicationApplicationLimited,
    setIsReplicationApplicationLimited,
  ] = useState(shouldEditRule ? !!existingRule.filter : true);
  const [replicationRulePrefix, setReplicationRulePrefix] = useState(
    shouldEditRule ? existingRule.filter?.prefix || '' : '',
  );
  const isValidReplicationRulePrefix = useMemo(() => {
    return validPrefixRegex.test(replicationRulePrefix);
  }, [replicationRulePrefix]);
  const [
    isReplicationRulePrefixTouched,
    setIsReplicationRulePrefixTouched,
  ] = useState(false);
  const [destination, setDestination] = useState<
    TReplicationDestination | undefined
  >(
    shouldEditRule && existingRule.destination
      ? {
          name: existingRule.destination.name,
          region: existingRule.destination.region,
          storageClass: existingRule.destination.storageClass,
        }
      : undefined,
  );
  const [destinationDetails, setDestinationDetails] = useState<
    TReplicationStorage | undefined
  >(undefined);

  const [useStorageclass, setUseStorageclass] = useState(
    shouldEditRule ? !!existingRule.destination?.storageClass : false,
  );
  const [storageClass, setStorageClass] = useState<ReplicationStorageClass>(
    shouldEditRule
      ? existingRule.destination?.storageClass
      : ReplicationStorageClass.STANDARD,
  );

  const [deleteMarkerReplication, setDeleteMarkerReplication] = useState<
    TReplicationStatus
  >(
    shouldEditRule
      ? existingRule.deleteMarkerReplication || STATUS_DISABLED
      : STATUS_DISABLED,
  );
  const [priority, setPriority] = useState<number>(
    shouldEditRule ? existingRule.priority : 1,
  );
  const [priorityError, setPriorityError] = useState<boolean>(false);

  const getInitialTags = useCallback((): TTagMap => {
    if (!shouldEditRule || !existingRule?.filter?.tags) return {};

    return Object.entries(existingRule.filter.tags).reduce<TTagMap>(
      (acc, [key, value], index) => {
        acc[index + 1] = { key, value };
        return acc;
      },
      {},
    );
  }, [shouldEditRule, existingRule?.filter?.tags]);

  const [tags, setTags] = useState<TTagMap>(getInitialTags);
  const [newTag, setNewTag] = useState(emptyTag);
  const [validationErrors, setValidationErrors] = useState<TValidationErrors>(
    {},
  );

  const [newTagErrors, setNewTagErrors] = useState<TTagValidationResult>({});

  const {
    data: serverDestinationContainer,
    isLoading: isLoadingDestination,
  } = useServerContainer(
    project?.project_id,
    destination?.region,
    destination?.name,
    null,
  );

  const { data: destinationRegion } = useGetRegion(
    project?.project_id,
    serverDestinationContainer?.region,
  );

  const handlePriorityChange = useCallback(
    (event: OdsInputChangeEvent, currentDestination = destination) => {
      const newValue = Math.round(Number(event.detail.value));

      if (newValue >= DEFAULT_PRIORITY && newValue <= MAX_PRIORITY) {
        const isPriorityTaken = container.replication?.rules.find((item) => {
          return (
            item.priority === newValue &&
            currentDestination?.name === item.destination?.name &&
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
    [container.replication, setPriority, replicationRuleIdParam, destination],
  );

  const handleDestinationChange = useCallback(
    (dest: TReplicationDestination) => {
      setDestination(dest);

      if (isEditMode && existingRule) {
        setPriority(existingRule.priority);
        handlePriorityChange(
          {
            detail: { value: existingRule.priority },
          } as OdsInputChangeEvent,
          dest,
        );
      } else {
        handlePriorityChange(
          { detail: { value: 1 } } as OdsInputChangeEvent,
          dest,
        );
      }
    },
    [setDestination, isEditMode, existingRule, handlePriorityChange],
  );

  useSyncStorageClass({
    isEditMode,
    existingRule,
    destinationRegion,
    destination,
    setUseStorageclass,
    setStorageClass,
  });

  const isButtonActive = useMemo(() => {
    const hasValidPrefix =
      (isValidReplicationRulePrefix && replicationRulePrefix !== '') ||
      replicationRulePrefix === '';

    const isReplicationApplicationMode =
      !isReplicationApplicationLimited ||
      (isReplicationApplicationLimited &&
        ((isValidReplicationRulePrefix && replicationRulePrefix !== '') ||
          Object.keys(tags).length > 0 ||
          !!newTag.key ||
          !!newTag.value));

    const objectLockError =
      serverDestinationContainer &&
      container.objectLock?.status === STATUS_ENABLED &&
      serverDestinationContainer?.objectLock?.status === STATUS_DISABLED;

    return (
      isValidReplicationRuleId &&
      hasValidPrefix &&
      isReplicationApplicationMode &&
      destination?.name &&
      serverDestinationContainer?.versioning?.status === STATUS_ENABLED &&
      !objectLockError &&
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
    isReplicationApplicationLimited,
    tags,
    newTag,
  ]);

  const { updateContainer, isPending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: container.s3StorageType,
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

  const getTagsErrors = useCallback(() => {
    const {
      validationErrors: errors,
      newTagErrors: newErrors,
    } = validateAllTags({ tags, newTag, t });

    setValidationErrors(errors);
    setNewTagErrors(newErrors);

    const hasTagErrors = Object.values(errors).some(
      (err) => err && Object.keys(err).length > 0,
    );

    const hasNewTagErrors = Object.keys(newErrors).length > 0;

    return !hasTagErrors && !hasNewTagErrors;
  }, [tags, newTag, t]);

  const onSubmitReplicationRule = () => {
    if (!isButtonActive) return;

    const hasTagsErrors = !getTagsErrors();

    let tagsToPass = {};
    if (!hasTagsErrors) {
      const transformedTags = Object.values(tags).reduce(
        (acc, { key, value }) => {
          if (key !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
      tagsToPass = {
        ...transformedTags,
        ...(newTag.key ? { [newTag.key]: newTag.value } : {}),
      };
    }

    const newReplicationRule = {
      id: replicationRuleId,
      status: replicationStatus,
      ...(isReplicationApplicationLimited && {
        filter: {
          ...(replicationRulePrefix && { prefix: replicationRulePrefix }),
          ...(Object.keys(tagsToPass).length > 0 && { tags: tagsToPass }),
        },
      }),
      destination: {
        name: destination?.name,
        region: destination?.region,
        storageClass: useStorageclass ? storageClass : undefined,
      },
      deleteMarkerReplication,
      priority,
    };

    const updatedRules = isEditMode
      ? container.replication?.rules.map((rule) =>
          rule.id === replicationRuleIdParam ? newReplicationRule : rule,
        )
      : [...(container.replication?.rules || []), newReplicationRule];

    if (!hasTagsErrors) {
      updateContainer({
        replication: {
          rules: updatedRules,
        },
      });
    }
  };
  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  return (
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
          setIsReplicationRuleIdTouched={setIsReplicationRuleIdTouched}
          isValidReplicationRuleId={isValidReplicationRuleId}
        />

        <ReplicationRuleApplication
          isReplicationApplicationLimited={isReplicationApplicationLimited}
          setIsReplicationApplicationLimited={
            setIsReplicationApplicationLimited
          }
          tags={tags}
          newTag={newTag}
          setDeleteMarkerReplication={setDeleteMarkerReplication}
        />

        {isReplicationApplicationLimited && (
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
              tags={tags}
              setTags={setTags}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              newTagErrors={newTagErrors}
              setNewTagErrors={setNewTagErrors}
              newTag={newTag}
              setNewTag={setNewTag}
              isEditMode={isEditMode}
              deleteMarkerReplication={deleteMarkerReplication}
            />
          </>
        )}

        <ReplicationRuleDeleteMarker
          deleteMarkerReplication={deleteMarkerReplication}
          setDeleteMarkerReplication={setDeleteMarkerReplication}
          asyncReplicationLink={asyncReplicationLink}
          tags={tags}
          newTag={newTag}
          isReplicationApplicationLimited={isReplicationApplicationLimited}
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
          destinationRegion={destinationRegion}
          sourceRegion={region}
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
          isDisabled={isPending || isLoadingDestination}
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
            onClick={onSubmitReplicationRule}
          />
        )}
      </div>
    </div>
  );
}

import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal, useBytes } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { Translation, useTranslation, Trans } from 'react-i18next';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import {
  useAllStorages,
  useStorage,
  useStorageEndpoint,
  useUpdateStorage,
} from '@/api/hooks/useStorages';

import { TContainer } from '../show/Show.page';
import { useServerContainer } from '@/api/hooks/useContainer';
import { useGetRegion } from '@/api/hooks/useRegion';

export default function DeleteReplicationPage() {
  const { t } = useTranslation(['containers/replication/delete']);

  const { addSuccess, addError } = useNotifications();

  const navigate = useNavigate();
  const { projectId, storageId, replicationId } = useParams();

  const [searchParams] = useSearchParams();

  const { storage: targetContainer } = useStorage(
    projectId,
    storageId,
    searchParams.get('region'),
  );

  const { url } = useStorageEndpoint(projectId, targetContainer);
  const { formatBytes } = useBytes();

  const { data: serverContainer, isLoading } = useServerContainer(
    projectId,
    searchParams.get('region'),
    targetContainer?.name,
    targetContainer?.id,
  );

  const { data: region } = useGetRegion(projectId, searchParams.get('region'));

  const container = useMemo((): TContainer => {
    if (!serverContainer) return undefined;
    const s3StorageType = targetContainer?.s3StorageType;

    return {
      ...serverContainer,
      id: serverContainer?.id || targetContainer?.id,
      name: serverContainer?.name || targetContainer?.name,
      objectsCount:
        serverContainer?.storedObjects || serverContainer?.objectsCount,
      usedSpace: formatBytes(
        serverContainer?.storedBytes || serverContainer?.objectsSize,
        2,
        1024,
      ),
      publicUrl: url,
      s3StorageType,
      regionDetails: s3StorageType ? region : undefined,
      staticUrl: serverContainer?.staticUrl || serverContainer?.virtualHost,
    };
  }, [serverContainer, region, targetContainer, url]);

  const { updateContainer, isPending: isUpdatePending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: container?.s3StorageType,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/replication/add">
          {(_t) =>
            _t(
              'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_error_message',
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
              'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_success_message',
            )
          }
        </Translation>,
        true,
      );
      navigate(`../?region=${searchParams.get('region')}`);
    },
  });

  const { data: storages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );

  const storageDetail = useMemo(() => {
    return storages?.resources.find(
      (s) =>
        s.name === storageId &&
        s.region === searchParams.get('region') &&
        !('containerType' in s),
    );
  }, [storages, storageId]);

  const onClose = () =>
    navigate({
      pathname: `..`,
      search: `?${createSearchParams({
        region: storageDetail.region,
      })}`,
    });

  const onCancel = () => {
    onClose();
  };

  const onConfirm = () => {
    const filteredRules = container?.replication?.rules?.filter(
      (rule) => rule.id !== replicationId,
    );

    updateContainer({
      replication: {
        rules: filteredRules || [],
      },
    });
  };

  return (
    <PciModal
      title={t(
        'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_replication_rule_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isUpdatePending || isStoragesPending || isLoading}
      isDisabled={isUpdatePending || isStoragesPending || isLoading}
      submitText={t(
        'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_replication_rule_cta',
      )}
      cancelText={t(
        'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_replication_rule_cancel',
      )}
    >
      <OdsText preset="paragraph">
        <Trans
          i18nKey={
            'containers/replication/delete:pci_projects_project_storages_containers_replication_delete_replication_rule_sub_title'
          }
          values={{ replicationId }}
          components={{
            strong: <strong />,
          }}
        />
      </OdsText>
    </PciModal>
  );
}

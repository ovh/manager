import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { PAGE_PREFIX } from '@/tracking.constants';
import { useAllStorages, useUpdateStorage } from '@/api/hooks/useStorages';

export default function EnableVersioningPage() {
  const { t } = useTranslation('containers/enable-versioning');

  const { addSuccess, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { projectId, storageId } = useParams();

  const [searchParams] = useSearchParams();

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
        region: searchParams.get('region'),
      })}`,
    });

  const onCancel = () => {
    onClose();
    tracking?.trackClick({
      name: `${PAGE_PREFIX}object::enable-versioning::cancel`,
      type: 'action',
    });
  };

  const { updateContainer, isPending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: storageDetail?.s3StorageType,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/enable-versioning">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_update_versioning_enable_error_message',
              {
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="containers/enable-versioning">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_update_versioning_enable_success_message',
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const onConfirm = () => {
    updateContainer({
      versioning: { status: 'enabled' },
    });

    tracking?.trackClick({
      name: `${PAGE_PREFIX}object::enable-versioning::confirm`,
      type: 'action',
    });
  };

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_containers_update_versioning_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending || isStoragesPending}
      isDisabled={isPending || isStoragesPending}
      submitText={t(
        'pci_projects_project_storages_containers_update_versioning_enable_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_update_versioning_cancel_label',
      )}
    >
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_containers_bucket_versioning_description',
        )}
      </OdsText>
    </PciModal>
  );
}

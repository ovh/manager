import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
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
import { ENABLE_ENCRYPTION_LINK } from '@/constants';

export default function EnableEncryptionPage() {
  const { t } = useTranslation('containers/enable-encryption');

  const { addSuccess, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { projectId, storageId } = useParams();

  const [searchParams] = useSearchParams();

  const { data: storages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );
  const context = useContext(ShellContext);

  const { ovhSubsidiary } = context.environment.getUser();

  const storageDetail = useMemo(() => {
    return storages?.resources.find(
      (s) =>
        s.name === storageId &&
        s.region === searchParams.get('region') &&
        !('containerType' in s),
    );
  }, [storages, storageId]);

  const enableEncryptionLink =
    ENABLE_ENCRYPTION_LINK[ovhSubsidiary] || ENABLE_ENCRYPTION_LINK.DEFAULT;

  const onClose = () =>
    navigate({
      pathname: `..`,
      search: `?${createSearchParams({
        region: storageDetail.region,
      })}`,
    });

  const onCancel = () => {
    onClose();
    tracking?.trackClick({
      name: `${PAGE_PREFIX}object::enable-encryption::cancel`,
      type: 'action',
    });
  };

  const { updateContainer, isPending: isUpdatePending } = useUpdateStorage({
    projectId,
    region: storageDetail.region,
    name: storageId,
    s3StorageType: storageDetail.s3StorageType,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/enable-encryption">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_update_encryption_enable_error_message',
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
        <Translation ns="containers/enable-encryption">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_update_encryption_enable_success_message',
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
      encryption: { sseAlgorithm: 'AES256' },
    });

    tracking?.trackClick({
      name: `${PAGE_PREFIX}object::enable-encryption::confirm`,
      type: 'action',
    });
  };

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_containers_update_encryption_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isUpdatePending || isStoragesPending}
      isDisabled={isUpdatePending || isStoragesPending}
      submitText={t(
        'pci_projects_project_storages_containers_update_encryption_enable_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_update_encryption_cancel_label',
      )}
    >
      <OdsText preset="paragraph">
        {t(
          'pci_projects_project_storages_containers_bucket_encryption_description',
        )}
      </OdsText>
      <OdsMessage className="my-6" color="information" isDismissible={false}>
        <OdsText preset="paragraph" className="my-3">
          {t(
            'pci_projects_project_storages_containers_bucket_encryption_banner',
          )}
          <OdsLink
            className="ml-4"
            color="primary"
            href={enableEncryptionLink}
            target="_blank"
            label={t(
              'pci_projects_project_storages_containers_update_encryption_link',
            )}
            icon="external-link"
          />
        </OdsText>
      </OdsMessage>
    </PciModal>
  );
}

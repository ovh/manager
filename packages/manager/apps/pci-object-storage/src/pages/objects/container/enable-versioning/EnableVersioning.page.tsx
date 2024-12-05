import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PAGE_PREFIX } from '@/tracking.constants';
import { useAllStorages, useUpdateStorage } from '@/api/hooks/useStorages';

export default function EnableVersioningPage() {
  const { t } = useTranslation('containers/enable-versioning');

  const { addSuccess, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();
  const { projectId, storageId } = useParams();

  const onClose = () => navigate(`..`);

  const onCancel = () => {
    navigate(`..`);
    tracking?.trackClick({
      name: `${PAGE_PREFIX}object::enable-versioning::cancel`,
      type: 'action',
    });
  };

  const [searchParams] = useSearchParams();

  const { data: storages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );

  const storageDetail = storages?.resources.find((s) => s.name === storageId);

  const { updateContainer, isPending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: storageDetail?.s3StorageType,
    onError(error: ApiError) {
      addError(
        <Translation ns="objects/activate-versioning">
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
        <Translation ns="objects/activate-versioning">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_update_versioning_enable_success_message',
            )
          }
        </Translation>,
        true,
      );
      navigate('..');
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
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_storages_containers_bucket_versioning_description',
        )}
      </OsdsText>
    </PciModal>
  );
}

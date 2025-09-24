import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { APP_NAME, SUB_UNIVERSE, UNIVERSE } from '@/tracking.constants';
import { useAllStorages, useUpdateStorage } from '@/api/hooks/useStorages';

export default function EnableVersioningPage() {
  const { t } = useTranslation('containers/enable-versioning');

  const { addSuccess, addError } = useNotifications();

  const { trackPage, trackClick } = useOvhTracking();
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

  const trackVersioningAction = (action: 'confirm' | 'cancel') => {
    trackClick({
      actions: [
        UNIVERSE,
        SUB_UNIVERSE,
        APP_NAME,
        'page',
        'button',
        'object_activate_versioning',
        action,
      ],
    });
  };

  const onCancel = () => {
    onClose();
    trackVersioningAction('cancel');
  };

  const { updateContainer, isPending } = useUpdateStorage({
    projectId,
    region: searchParams.get('region'),
    name: storageId,
    s3StorageType: storageDetail?.s3StorageType,
    onError(error: ApiError) {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'object_activate_versioning_error',
      });
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
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'object_activate_versioning_success',
      });
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
    trackVersioningAction('confirm');
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

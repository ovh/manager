import { ApiError } from '@ovh-ux/manager-core-api';
import { DeletionModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsInput, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useDeleteObject } from '@/api/hooks/useObject';
import { useStorage } from '@/api/hooks/useStorages';
import {
  APP_NAME,
  PERMANENTLY_DELETE_MSG,
  SUB_UNIVERSE,
  UNIVERSE,
} from '@/constants';

export default function DeletePage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('objects/delete');
  const { trackPage, trackClick } = useOvhTracking();

  const navigate = useNavigate();
  const { projectId, storageId, objectName } = useParams();
  const decodedObjectName = decodeURIComponent(atob(objectName));
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const versionId = searchParams.get('versionId');

  const isLocalZone = searchParams.get('isLocalZone');
  const isSwift = searchParams.get('isSwift');
  const isVersioningDisabled = searchParams.get('isVersioningDisabled');
  const isVersioningSuspended = searchParams.get('isVersioningSuspended');
  const isLastElement = searchParams.get('isLastElement');

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (deleteConfirmation === PERMANENTLY_DELETE_MSG) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [deleteConfirmation]);

  let nameError: string | undefined;
  useEffect(() => {
    if (isTouched && !isValid) {
      nameError = t('pci-common:common_field_error_pattern');
    }
  }, [isTouched, isValid]);

  const { storage, isPending: isPendingStorage } = useStorage(
    projectId,
    storageId,
    region,
  );

  const isPermanentDelete = useMemo(() => {
    return (
      versionId ||
      isLocalZone ||
      isSwift ||
      isVersioningDisabled ||
      isVersioningSuspended
    );
  }, [
    versionId,
    isLocalZone,
    isSwift,
    isVersioningDisabled,
    isVersioningSuspended,
  ]);

  const goBack = () => {
    trackClick({
      actions: [
        UNIVERSE,
        SUB_UNIVERSE,
        APP_NAME,
        `pop-up`,
        'button',
        'delete_object_versioning',
        'cancel',
      ],
    });
    navigate(`../?region=${region}&refetch=true`);
  };

  const onCancel = goBack;
  const onClose = () => {
    if (isLastElement) {
      navigate(`../../${storageId}?region=${region}&refetch=true`);
    } else {
      goBack();
    }
  };

  const { deleteObject, isPending: isPendingDelete } = useDeleteObject({
    projectId,
    objectName: decodedObjectName,
    storage,
    region,
    versionId,
    onError(error: ApiError) {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_object_versioning_error',
      });
      addError(
        <Translation ns="objects/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_object_delete_object_error_delete',
              {
                object: decodedObjectName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      goBack();
    },
    onSuccess() {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_object_versioning_success',
      });
      addSuccess(
        <Translation ns="objects/delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_object_delete_object_success_message',
              {
                object: decodedObjectName,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const onConfirm = () => {
    trackClick({
      actions: [
        UNIVERSE,
        SUB_UNIVERSE,
        APP_NAME,
        `pop-up`,
        'button',
        'delete_object_versioning',
        'confirm',
      ],
    });
    deleteObject();
  };

  const isPending = isPendingStorage || isPendingDelete;

  return (
    <DeletionModal
      title={t(
        isPermanentDelete
          ? 'pci_projects_project_storages_containers_container_object_delete_object_permanently_title'
          : 'pci_projects_project_storages_containers_container_object_delete_object_title',
      )}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      isDisabled={
        isPending ||
        ((versionId ||
          isLocalZone ||
          isSwift ||
          isVersioningDisabled ||
          isVersioningSuspended) &&
          !isValid)
      }
      submitText={t(
        'pci_projects_project_storages_containers_container_object_delete_submit_label',
      )}
      cancelText={t(
        'pci_projects_project_storages_containers_container_object_delete_cancel_label',
      )}
    >
      {isPermanentDelete ? (
        <>
          <OdsMessage
            color="warning"
            className="mt-6 mb-6"
            isDismissible={false}
          >
            <OdsText>
              {t(
                isLocalZone ||
                  isSwift ||
                  isVersioningDisabled ||
                  isVersioningSuspended
                  ? 'pci_projects_project_storages_containers_container_object_delete_permanent_delete_no_version_text'
                  : 'pci_projects_project_storages_containers_container_object_delete_permanent_delete_version_text',
                { object: decodedObjectName },
              )}
            </OdsText>
          </OdsMessage>

          <div className="block w-full">
            <label
              slot="label"
              className={`block w-full max-w-2xl text-[#4d5592] font-semibold ${
                nameError ? 'text-critical' : ''
              }`}
            >
              {t(
                'pci_projects_project_storages_containers_container_object_delete_permanent_delete_help',
                { confirmKey: PERMANENTLY_DELETE_MSG },
              )}
            </label>
            <OdsInput
              className="block w-full mt-3"
              value={deleteConfirmation}
              name="deleteConfirmation"
              color="primary"
              isRequired
              onOdsChange={(event) => {
                setDeleteConfirmation(`${event.detail.value || ''}`);
              }}
              onOdsBlur={() => {
                setIsTouched(true);
              }}
            />
          </div>
        </>
      ) : (
        <OdsText>
          {t(
            'pci_projects_project_storages_containers_container_object_delete_content',
            { object: decodedObjectName },
          )}
        </OdsText>
      )}
    </DeletionModal>
  );
}

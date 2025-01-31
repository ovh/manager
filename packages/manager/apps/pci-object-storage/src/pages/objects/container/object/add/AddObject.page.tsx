import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  OBJECT_CONTAINER_STORAGE_CLASS,
  STORAGE_PRICES_LINK,
  TRACKING_PREFIX,
} from '@/constants';
import LabelComponent from '@/components/Label.component';
import FileInputComponent from '@/components/FileInput.component';
import { useStorage } from '@/api/hooks/useStorages';
import { useAddObjects } from '@/api/hooks/useObject';
import { useAddObjectForm } from './useAddObjectsForm';
import { useGetRegion } from '@/api/hooks/useRegion';

export default function AddObjectPage() {
  const { t } = useTranslation(['objects/add', 'pci-common']);
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');

  const { projectId, storageId } = useParams();
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();

  const {
    environment,
    shell: { tracking },
  } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  const PRICE_LINK =
    STORAGE_PRICES_LINK[ovhSubsidiary] || STORAGE_PRICES_LINK.DEFAULT;

  const {
    formState,
    updatePrefix,
    updateStorageClass,
    updateFiles,
    isFormValid,
  } = useAddObjectForm();

  const { storage: container, isPending: isStoragePending } = useStorage(
    projectId,
    storageId,
    searchParams.get('region'),
  );

  const goBack = () =>
    navigate({
      pathname: `..`,
      search: `?region=${region}`,
    });

  const handleSuccess = () => {
    addSuccess(
      <Translation ns="objects/add">
        {(_t) =>
          _t(
            'pci_projects_project_storages_containers_container_object_add_object_success_message',
          )
        }
      </Translation>,
      true,
    );
    goBack();
  };

  const handleError = (error: ApiError) => {
    addError(
      <Translation ns="objects/add">
        {(_t) =>
          _t(
            'pci_projects_project_storages_containers_container_object_add_object_error_delete',
            {
              message: error?.response?.data?.message || error?.message || null,
            },
          )
        }
      </Translation>,
      true,
    );
    goBack();
  };

  const { addObjects, isPending: isAddPending } = useAddObjects({
    projectId,
    container,
    prefix: formState.prefix,
    storageClass: formState.storageClass,
    files: formState.files,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const { data: containerRegion, isPending: isRegionPending } = useGetRegion(
    projectId,
    region,
  );

  const showStorageClass = useMemo(
    () =>
      containerRegion?.services?.some(
        (item) => item.name === 'storage-s3-high-perf' && item.status === 'UP',
      ),
    [containerRegion?.services],
  );

  const onConfirm = () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}object::add::confirm`,
      type: 'action',
    });

    addObjects();
  };

  const onClose = () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}object::add::cancel`,
      type: 'action',
    });
    goBack();
  };

  return (
    <PciModal
      title={t(
        'pci_projects_project_storages_containers_container_object_add_object_title',
      )}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      isPending={
        !container || isAddPending || isStoragePending || isRegionPending
      }
      cancelText={t(
        'pci_projects_project_storages_containers_container_object_add_cancel_label',
      )}
      submitText={t(
        'pci_projects_project_storages_containers_container_object_add_submit_label',
      )}
      isDisabled={!isFormValid}
    >
      {container?.s3StorageType && !showStorageClass && (
        <OdsMessage className="my-6" isDismissible={false}>
          {t(
            'pci_projects_project_storages_containers_container_object_add_storage_class_info_banner',
          )}
        </OdsMessage>
      )}

      {container?.s3StorageType && (
        <div>
          <OdsText>
            {t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label_description',
            )}
          </OdsText>
          <Links
            className="ml-3"
            href={PRICE_LINK}
            type={LinkType.next}
            target={LinkType.external}
            label={t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label_description_link',
            )}
          />
        </div>
      )}

      <OdsFormField
        className="w-full my-4"
        error={
          !formState.prefix ? t('pci-common:common_field_error_required') : ''
        }
      >
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_object_add_prefix_label',
          )}
        />

        <OdsInput
          id="prefix"
          name="prefix"
          isRequired
          max={32}
          value={formState.prefix}
          hasError={!formState.prefix}
          onOdsChange={(event) => updatePrefix(`${event.detail.value}`)}
        />
      </OdsFormField>

      {container?.s3StorageType && showStorageClass && (
        <div className="my-6">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label',
            )}
          />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <OdsRadio
                value={OBJECT_CONTAINER_STORAGE_CLASS.STANDARD}
                name="swiftFileType"
                inputId="swiftFileType"
                isChecked={
                  formState.storageClass ===
                  OBJECT_CONTAINER_STORAGE_CLASS.STANDARD
                }
                onOdsChange={(event) => updateStorageClass(event.detail.value)}
              />
              <label htmlFor="swiftFileType">
                <OdsText preset="span">
                  {t(
                    'pci_projects_project_storages_containers_container_object_add_storage_class_standard',
                  )}
                </OdsText>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <OdsRadio
                value={OBJECT_CONTAINER_STORAGE_CLASS.HIGH_PERFORMANCE}
                name="s3FileType"
                inputId="s3FileType"
                isChecked={
                  formState.storageClass ===
                  OBJECT_CONTAINER_STORAGE_CLASS.HIGH_PERFORMANCE
                }
                onOdsChange={(event) => updateStorageClass(event.detail.value)}
              />
              <label htmlFor="s3FileType">
                <OdsText preset="span">
                  {t(
                    'pci_projects_project_storages_containers_container_object_add_storage_class_high_perf',
                  )}
                </OdsText>
              </label>
            </div>
          </div>
        </div>
      )}

      <OdsFormField className="w-full my-4">
        <FileInputComponent
          dropzoneLabel={t(
            'pci_projects_project_storages_containers_container_object_add_files_label',
          )}
          selectedFiles={formState.files}
          setSelectedFiles={updateFiles}
        />
      </OdsFormField>
    </PciModal>
  );
}

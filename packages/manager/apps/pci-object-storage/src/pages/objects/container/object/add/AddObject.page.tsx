import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  Links,
  LinkType,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OBJECT_CONTAINER_STORAGE_CLASS,
  STORAGE_PRICES_LINK,
  TRACKING_PREFIX,
} from '@/constants';
import LabelComponent from '@/components/Label.component';
import FileInputComponent from '@/components/FileInput.component';
import { useAllStorages } from '@/api/hooks/useStorages';
import { useAddObjects } from '@/api/hooks/useObject';
import { useAddObjectForm } from './useAddObjectsForm';

export default function AddObjectPage() {
  const { t } = useTranslation(['objects/add', 'pci-common']);

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
  const isStorageClass = OBJECT_CONTAINER_STORAGE_CLASS.STANDARD;

  const {
    formState,
    updatePrefix,
    updateStorageClass,
    updateFiles,
    isFormValid,
  } = useAddObjectForm();

  const { data: allContainers } = useAllStorages(projectId);

  const targetContainer = useMemo(
    () =>
      allContainers?.resources.find(
        (c) => c.id === storageId || c.name === storageId,
      ),
    [allContainers, storageId],
  );

  const goBack = () => navigate(`..`);

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
    container: targetContainer,
    prefix: formState.prefix,
    storageClass: formState.storageClass,
    files: formState.files,
    onSuccess: handleSuccess,
    onError: handleError,
  });

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
      isPending={!targetContainer || isAddPending}
      cancelText={t(
        'pci_projects_project_storages_containers_container_object_add_cancel_label',
      )}
      submitText={t(
        'pci_projects_project_storages_containers_container_object_add_submit_label',
      )}
      isDisabled={!isFormValid}
    >
      {targetContainer?.s3StorageType && !isStorageClass && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="my-6">
          {t(
            'pci_projects_project_storages_containers_container_object_add_storage_class_info_banner',
          )}
        </OsdsMessage>
      )}

      {targetContainer?.s3StorageType && (
        <div>
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label_description',
            )}
          </OsdsText>
          <Links
            className="ml-3"
            href={PRICE_LINK}
            type={LinkType.next}
            target={OdsHTMLAnchorElementTarget._blank}
            label={t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label_description_link',
            )}
          />
        </div>
      )}

      <OsdsFormField
        className="my-8"
        error={
          !formState.prefix ? t('pci-common:common_field_error_required') : ''
        }
      >
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_object_add_prefix_label',
          )}
          hasError={!formState.prefix}
        />

        <OsdsInput
          id="prefix"
          name="prefix"
          required
          max={32}
          type={ODS_INPUT_TYPE.text}
          value={formState.prefix}
          error={!formState.prefix}
          onOdsValueChange={(event) => updatePrefix(event.detail.value)}
        />
      </OsdsFormField>

      {targetContainer?.s3StorageType && isStorageClass && (
        <OsdsFormField className="mt-6 mb-8">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_container_object_add_storage_class_label',
            )}
            hasError={false}
          />
          <OsdsRadioGroup
            required
            value={formState.storageClass}
            onOdsValueChange={(event) =>
              updateStorageClass(event.detail.newValue)
            }
          >
            <OsdsRadio
              value={OBJECT_CONTAINER_STORAGE_CLASS.STANDARD}
              name="swiftFileType"
              className="mr-4"
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <OsdsRadioButton
                size={ODS_RADIO_BUTTON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                <OsdsText
                  slot="end"
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className={
                    formState.storageClass ===
                    OBJECT_CONTAINER_STORAGE_CLASS.STANDARD
                      ? 'font-bold'
                      : 'font-normal'
                  }
                >
                  {t(
                    'pci_projects_project_storages_containers_container_object_add_storage_class_standard',
                  )}
                </OsdsText>
              </OsdsRadioButton>
            </OsdsRadio>
            <OsdsRadio
              value={OBJECT_CONTAINER_STORAGE_CLASS.HIGH_PERFORMANCE}
              name="s3FileType"
            >
              <OsdsRadioButton
                size={ODS_RADIO_BUTTON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                  slot="end"
                  className={
                    formState.storageClass ===
                    OBJECT_CONTAINER_STORAGE_CLASS.HIGH_PERFORMANCE
                      ? 'font-bold'
                      : 'font-normal'
                  }
                >
                  {t(
                    'pci_projects_project_storages_containers_container_object_add_storage_class_high_perf',
                  )}
                </OsdsText>
              </OsdsRadioButton>
            </OsdsRadio>
          </OsdsRadioGroup>
        </OsdsFormField>
      )}

      <OsdsFormField className="mt-4">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_object_add_files_label',
          )}
        />
        <FileInputComponent onFilesSelected={updateFiles} />
      </OsdsFormField>
    </PciModal>
  );
}

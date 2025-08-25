import {
  OsdsButton,
  OsdsMessage,
  OsdsModal,
  OsdsSkeleton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SKELETON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Encryption } from '@/components/Encryption';
import { EncryptionType } from '@/api/select/volume';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';
import { useCatalogWithPreselection } from '@/api/hooks/useCatalogWithPreselection';

type FormValues = {
  volumeModel: TVolumeModel;
  encryptionType: EncryptionType;
};

export const RetypePage = () => {
  const { t } = useTranslation(['common', 'retype']);
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const {
    data,
    preselectedEncryptionType,
    isPending,
  } = useCatalogWithPreselection(projectId, volumeId);
  const onClose = () => navigate('..');

  const currentModel = useMemo(() => data?.find((m) => m.isPreselected), [
    data,
  ]);

  const {
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm({
    defaultValues: {
      volumeModel: null,
      encryptionType: null,
    },
    values: {
      volumeModel: currentModel,
      encryptionType: preselectedEncryptionType,
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) =>
    // TODO Change this when backend is ready
    alert(
      `You choose: ${formData.volumeModel.name} and ${formData.encryptionType}`,
    );

  const displayedData =
    data?.length > 0 ? (
      <div>
        <Controller
          control={control}
          name="volumeModel"
          render={({ field: { value, onChange } }) => (
            <VolumeModelTilesInput
              value={value}
              volumeModels={data}
              onChange={onChange}
              label={t(
                'retype:pci_projects_project_storages_blocks_retype_change_type_title',
              )}
            />
          )}
        />
        <div>
          <Controller
            control={control}
            name="encryptionType"
            render={({ field: { value, onChange } }) => (
              <Encryption
                encryptionType={value}
                onChange={onChange}
                title={t(
                  'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
                )}
              />
            )}
          />
        </div>
      </div>
    ) : (
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning}>
        {t('retype:pci_projects_project_storages_blocks_retype_cant_retype')}
      </OsdsMessage>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <OsdsModal onOdsModalClose={onClose}>
        <slot>
          <legend>
            <Subtitle>
              {t('retype:pci_projects_project_storages_blocks_retype_title')}
            </Subtitle>
          </legend>
          {!isPending ? (
            displayedData
          ) : (
            <div>
              <OsdsSkeleton
                size={ODS_SKELETON_SIZE.lg}
                className="h-20"
                data-testid="retypePage-loader"
              />
              <OsdsSkeleton size={ODS_SKELETON_SIZE.lg} className="h-10" />
            </div>
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
          type={ODS_BUTTON_TYPE.button}
        >
          {t('common:pci_projects_project_storages_blocks_button_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={!isDirty || undefined}
          type={ODS_BUTTON_TYPE.submit}
        >
          {t('common:pci_projects_project_storages_blocks_button_validate')}
        </OsdsButton>
      </OsdsModal>
    </form>
  );
};

export default RetypePage;

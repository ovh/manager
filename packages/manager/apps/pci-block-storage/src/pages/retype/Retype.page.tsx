import {
  OsdsButton,
  OsdsMessage,
  OsdsModal,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Subtitle, Title } from '@ovh-ux/manager-react-components';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
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
  const { t } = useTranslation(['common', 'retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { projectId, volumeId } = useParams();
  const {
    data: volumeModelData,
    preselectedEncryptionType,
    isPending,
  } = useCatalogWithPreselection(projectId, volumeId);
  const onClose = () => navigate('..');

  const currentModel = useMemo(
    () => volumeModelData?.find((model) => model.isPreselected),
    [volumeModelData],
  );

  const {
    control,
    formState: { dirtyFields },
    handleSubmit,
    watch,
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

  const selectedModel = watch('volumeModel');
  const isDirty =
    dirtyFields.encryptionType || selectedModel?.name !== currentModel?.name;

  const onSubmit: SubmitHandler<FormValues> = () => {
    // TODO Change this when backend is ready
  };

  const displayedData =
    volumeModelData?.length > 0 ? (
      <div>
        <Controller
          control={control}
          name="volumeModel"
          render={({ field: { value, onChange } }) => (
            <VolumeModelTilesInput
              value={value}
              volumeModels={volumeModelData}
              onChange={onChange}
              label={t(
                'retype:pci_projects_project_storages_blocks_retype_change_type_title',
              )}
            />
          )}
        />
        <div>
          {selectedModel?.encrypted ? (
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
          ) : (
            <div>
              <Subtitle>
                {t(
                  'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
                )}
              </Subtitle>
              <div>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(
                    'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
                  )}
                </OsdsText>
              </div>
            </div>
          )}
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
            <Title>
              {t('retype:pci_projects_project_storages_blocks_retype_title')}
            </Title>
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
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={!isDirty || undefined}
          type={ODS_BUTTON_TYPE.submit}
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </OsdsButton>
      </OsdsModal>
    </form>
  );
};

export default RetypePage;

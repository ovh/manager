import { useNavigate } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Message,
  MESSAGE_COLOR,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { Encryption } from '@/components/Encryption';
import { EncryptionType } from '@/api/select/volume';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';

type FormValues = {
  volumeModel: TVolumeModel;
  encryptionType: EncryptionType;
};

type RetypeProps = {
  volumeModelData: TVolumeRetypeModel[];
  preselectedEncryptionType: EncryptionType;
};

export const RetypeForm: FC<RetypeProps> = ({
  volumeModelData,
  preselectedEncryptionType,
}) => {
  const { t } = useTranslation(['common', 'retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

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

  const onClose = () => {
    navigate('..');
  };

  const onSubmit: SubmitHandler<FormValues> = () => {
    // TODO Change this when backend is ready
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      {volumeModelData?.length > 0 ? (
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
                horizontal
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
                <Text preset={TEXT_PRESET.heading2}>
                  {t(
                    'retype:pci_projects_project_storages_blocks_retype_title',
                  )}
                </Text>
                <Text>
                  {t(
                    'retype:pci_projects_project_storages_blocks_retype_encryption_not_available',
                  )}
                </Text>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Message
          color={MESSAGE_COLOR.warning}
          dismissible={false}
          className="max-w-80"
        >
          {t('retype:pci_projects_project_storages_blocks_retype_cant_retype')}
        </Message>
      )}
      <div className="flex gap-8 mt-auto">
        <Button
          slot="actions"
          variant={BUTTON_VARIANT.ghost}
          onClick={onClose}
          type="button"
        >
          {t(`${NAMESPACES.ACTIONS}:cancel`)}
        </Button>
        <Button
          slot="actions"
          color={BUTTON_COLOR.primary}
          variant={BUTTON_VARIANT.default}
          disabled={!isDirty}
          type="submit"
        >
          {t(`${NAMESPACES.ACTIONS}:modify`)}
        </Button>
      </div>
    </form>
  );
};

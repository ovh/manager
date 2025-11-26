import { useNavigate } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { BaseRetypeForm } from './BaseRetypeForm.component';

type FormValues = {
  volumeModel: TVolumeModel;
};

type RetypeProps = {
  volumeModelData: TVolumeRetypeModel[];
};

export const Retype: FC<RetypeProps> = ({ volumeModelData }) => {
  const { t } = useTranslation(['common', 'retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const currentModel = useMemo(
    () => volumeModelData.find((model) => model.isPreselected),
    [volumeModelData],
  );

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      volumeModel: null,
    },
    values: {
      volumeModel: currentModel,
    },
    mode: 'onSubmit',
  });

  const selectedModel = watch('volumeModel');
  const isDirty = selectedModel?.name !== currentModel?.name;

  const onClose = () => {
    navigate('..');
  };

  const onSubmit: SubmitHandler<FormValues> = () => {
    // TODO Change this when backend is ready
  };

  return (
    <BaseRetypeForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isValidationDisabled={!isDirty}
      cancelButtonText={t(`${NAMESPACES.ACTIONS}:cancel`)}
      validateButtonText={t(`${NAMESPACES.ACTIONS}:modify`)}
    >
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
              hideBadges
            />
          )}
        />
      </div>
    </BaseRetypeForm>
  );
};

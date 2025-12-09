import { useNavigate } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { BaseRetypeForm } from './BaseRetypeForm.component';
import { useRetypeVolume } from '@/api/hooks/useVolume';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { TAPIVolume } from '@/api/data/volume';

type FormValues = {
  volumeModel: TVolumeModel;
};

type RetypeProps = {
  projectId: string;
  volumeId: string;
  volumeModelData: TVolumeRetypeModel[];
};

export const Retype: FC<RetypeProps> = ({
  projectId,
  volumeId,
  volumeModelData,
}) => {
  const { t } = useTranslation(['common', 'retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { addSuccess } = useNotifications();

  const onRetypeSuccess = useTrackBanner(
    { type: 'success' },
    (originalVolume: TAPIVolume) => {
      navigate('..');
      addSuccess(
        <div className="pr-6">
          <Translation ns="retype">
            {(_t) =>
              _t('pci_projects_project_storages_blocks_retype_retype_success', {
                volumeName: originalVolume?.name,
              })
            }
          </Translation>
        </div>,
        true,
      );
    },
  );

  const {
    retypeVolume,
    isPending: isRetypingPending,
    isError: isRetypingError,
  } = useRetypeVolume({
    projectId,
    volumeId,
    onSuccess: onRetypeSuccess,
  });

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

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    retypeVolume({
      type: formValues.volumeModel.name,
    });
  };

  return (
    <BaseRetypeForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isValidationDisabled={!isDirty}
      cancelButtonText={t(`${NAMESPACES.ACTIONS}:cancel`)}
      validateButtonText={t(`${NAMESPACES.ACTIONS}:modify`)}
      isLoading={isRetypingPending}
    >
      <div>
        {isRetypingError && (
          <Message dismissible={false} color={MESSAGE_COLOR.critical}>
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              {t(
                'retype:pci_projects_project_storages_blocks_retype_retype_error',
              )}
            </MessageBody>
          </Message>
        )}
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
              disabled={isRetypingPending}
            />
          )}
        />
      </div>
    </BaseRetypeForm>
  );
};

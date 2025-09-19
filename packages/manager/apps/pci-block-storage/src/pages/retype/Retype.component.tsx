import { useNavigate } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Encryption } from '@/components/Encryption';
import { EncryptionType } from '@/api/select/volume';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { VolumeModelTilesInput } from '@/components/VolumeModelTilesInput.component';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';
import { BaseRetypeForm } from './BaseRetypeForm.component';
import { useRetypeVolume } from '@/api/hooks/useVolume';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { TAPIVolume } from '@/api/data/volume';

type FormValues = {
  volumeModel: TVolumeModel;
  encryptionType: EncryptionType;
};

type RetypeProps = {
  projectId: string;
  volumeId: string;
  volumeModelData: TVolumeRetypeModel[];
  preselectedEncryptionType: EncryptionType | null;
};

export const Retype: FC<RetypeProps> = ({
  projectId,
  volumeId,
  volumeModelData,
  preselectedEncryptionType,
}) => {
  const { t } = useTranslation(['common', 'retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { addSuccess } = useNotifications();

  const onRetypeSuccess = useTrackBanner(
    { type: 'success' },
    (originalVolume: TAPIVolume) => {
      navigate('..');
      addSuccess(
        <Translation ns="retype">
          {(_t) =>
            _t('pci_projects_project_storages_blocks_retype_retype_success', {
              volumeName: originalVolume?.name,
            })
          }
        </Translation>,
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

  const onSubmit: SubmitHandler<FormValues> = (formValues) => {
    retypeVolume({
      type: formValues.volumeModel.name,
      encryptionType: formValues.encryptionType,
    });
  };

  return (
    <BaseRetypeForm
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isValidationDisabled={!isDirty && !isRetypingPending}
      cancelButtonText={t(`${NAMESPACES.ACTIONS}:cancel`)}
      validateButtonText={t(`${NAMESPACES.ACTIONS}:modify`)}
    >
      <div>
        {isRetypingError && (
          <Message dismissible={false} color={MESSAGE_COLOR.critical}>
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              {t('pci_projects_project_storages_blocks_retype_retype_error')}
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
              onChange={!isRetypingPending && onChange}
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
                  onChange={!isRetypingPending && onChange}
                  title={t(
                    'retype:pci_projects_project_storages_blocks_retype_change_encryption_title',
                  )}
                />
              )}
            />
          ) : (
            <div>
              <Text preset={TEXT_PRESET.heading2}>
                {t('retype:pci_projects_project_storages_blocks_retype_title')}
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
    </BaseRetypeForm>
  );
};

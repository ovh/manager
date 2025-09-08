import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_VARIANT,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  Message,
  MESSAGE_COLOR,
  Skeleton,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
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

  const [isOpen, setIsOpen] = useState(true);

  const onClose = () => {
    setIsOpen(false);
    navigate('..');
  };

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
    ) : (
      <Message
        color={MESSAGE_COLOR.warning}
        dismissible={false}
        className="max-w-80"
      >
        {t('retype:pci_projects_project_storages_blocks_retype_cant_retype')}
      </Message>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[var(--ods-color-primary-500)] opacity-75 w-full h-full absolute top-0 left-0"
    >
      <Drawer open={isOpen}>
        <DrawerContent
          position={DRAWER_POSITION.right}
          className="w-fit flex flex-col justify-between h-[unset]"
        >
          <DrawerBody className="flex flex-col gap-8">
            <legend>
              <Text preset={TEXT_PRESET.heading2}>
                {t('retype:pci_projects_project_storages_blocks_retype_title')}
              </Text>
            </legend>
            {isPending ? (
              <div
                className="flex flex-col gap-8"
                data-testid="retypePage-loader"
              >
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : (
              displayedData
            )}
          </DrawerBody>
          <div className="flex gap-8">
            <Button
              slot="actions"
              variant={BUTTON_VARIANT.ghost}
              onClick={onClose}
              type="button"
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button slot="actions" disabled={!isDirty} type="submit">
              {t(`${NAMESPACES.ACTIONS}:modify`)}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </form>
  );
};

export default RetypePage;

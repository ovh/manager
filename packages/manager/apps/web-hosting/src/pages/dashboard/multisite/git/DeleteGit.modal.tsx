import { useCallback, useState } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { Checkbox, CheckboxControl, CheckboxLabel, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { MODAL_COLOR, Modal, useNotifications } from '@ovh-ux/muk';

import { deleteGitAssociation } from '@/data/api/git';
import { useGetHostingServiceWebsite } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

interface DeleteGitModalState {
  serviceName: string;
  path?: string;
}

interface FormValues {
  deleteFiles: boolean;
}

export default function DeleteGitModal() {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'multisite', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);
  const { state } = useLocation() as Location<DeleteGitModalState>;
  const { data } = useGetHostingServiceWebsite(state?.serviceName, state?.path);
  const { addError, addSuccess } = useNotifications();
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      deleteFiles: false,
    },
  });

  const [isConfirmingDeleteFiles, setIsConfirmingDeleteFiles] = useState(false);
  const deleteFiles = watch('deleteFiles');

  const onClose = () => {
    navigate(-1);
  };

  const { mutate: onDelete } = useMutation<void, ApiError, { websiteId: string[] }>({
    mutationFn: async ({ websiteId }) => {
      try {
        await deleteGitAssociation(state.serviceName, websiteId[0], deleteFiles);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite:multisite_git_modal_delete_association_success')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      if (!data || data.length === 0) {
        console.error(error);
        return null;
      }
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      onClose();
    },
  });

  const onPrimaryButtonClick = useCallback(() => {
    if (deleteFiles && !isConfirmingDeleteFiles) {
      setIsConfirmingDeleteFiles(true);
      return;
    }
    handleSubmit(() => {
      onDelete({ websiteId: [data[0]] });
    })().catch(console.error);
  }, [data, deleteFiles, handleSubmit, onDelete, isConfirmingDeleteFiles]);

  return (
    <Modal
      heading={t('multisite:multisite_git_modal_delete_association_title')}
      type={MODAL_COLOR.warning}
      onOpenChange={onClose}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onPrimaryButtonClick,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      {!deleteFiles ? (
        <>
          <Text>{t('multisite:multisite_git_modal_delete_association_description1')}</Text>
          <Text className="mt-4">
            <Trans i18nKey="multisite:multisite_git_modal_delete_association_description2" />
          </Text>
        </>
      ) : (
        <Text>{t('multisite:multisite_git_modal_delete_association_warning_delete_dir')}</Text>
      )}
      <div className="mt-4">
        <Controller
          name="deleteFiles"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              name="deleteFiles"
              onCheckedChange={(detail) => {
                field.onChange(detail.checked);
                setIsConfirmingDeleteFiles(false);
              }}
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text>
                  <Trans
                    i18nKey="multisite:multisite_git_modal_delete_association_description3"
                    values={{ path: state?.path ?? '' }}
                  />
                </Text>
              </CheckboxLabel>
            </Checkbox>
          )}
        />
      </div>
    </Modal>
  );
}

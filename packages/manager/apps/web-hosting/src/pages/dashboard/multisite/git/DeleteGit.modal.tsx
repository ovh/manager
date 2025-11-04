import { useCallback, useState } from 'react';

import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

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
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('multisite:multisite_git_modal_delete_association_success')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      if (!data || data.length === 0) {
        console.error(error);
        return null;
      }
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.ERROR}:error_message`, {
            message: error?.response?.data?.message,
          })}
        </OdsText>,
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
      type={ODS_MODAL_COLOR.warning}
      onDismiss={onClose}
      isOpen
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onClose}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
    >
      {!deleteFiles ? (
        <>
          <OdsText>{t('multisite:multisite_git_modal_delete_association_description1')}</OdsText>
          <OdsText className="mt-4">
            <Trans i18nKey="multisite:multisite_git_modal_delete_association_description2" />
          </OdsText>
        </>
      ) : (
        <OdsText>
          {t('multisite:multisite_git_modal_delete_association_warning_delete_dir')}
        </OdsText>
      )}
      <div className="mt-4">
        <Controller
          name="deleteFiles"
          control={control}
          render={({ field }) => (
            <OdsCheckbox
              isChecked={field.value}
              name="deleteFiles"
              onOdsChange={(e) => {
                field.onChange(e.detail.checked);
                setIsConfirmingDeleteFiles(false);
              }}
            />
          )}
        />
        <OdsText className="ml-4">
          <Trans
            i18nKey="multisite:multisite_git_modal_delete_association_description3"
            values={{ path: state?.path ?? '' }}
          />
        </OdsText>
      </div>
    </Modal>
  );
}

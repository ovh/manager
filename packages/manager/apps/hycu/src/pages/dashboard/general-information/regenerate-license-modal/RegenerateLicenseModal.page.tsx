import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  MODAL_TYPE,
  Text,
  TEXT_PRESET,
  Notifications,
  useNotifications,
} from '@ovh-ux/muk';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FileInputField } from '@/components/FileUpload/FileUpload.component';
import { useRegenerateLicenseHYCUMutation } from '@/hooks/api/license';

export type RegenerateHycuLicenseModalProps = {
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmRegenerateHycuLicense: () => void;
};

interface FormValues {
  license?: string;
}

export const RegenerateHycuLicenseModal: React.FC<RegenerateHycuLicenseModalProps> = () => {
  const { serviceName } = useParams();
  const { t } = useTranslation(['hycu/dashboard', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addInfo, addError } = useNotifications();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>();
  const {
    mutate,
    isPending: isRegeneratePending,
  } = useRegenerateLicenseHYCUMutation({
    onSuccess: () => {
      addInfo(t('hycu_dashboard_regenerate_success_message'), true);
      closeModal();
    },
    onError: () => {
      addError(t('hycu_dashboard_regenerate_error_message'));
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isValid) {
      mutate({ serviceName, licenseContent: data.license });
    }
  };

  return (
    <Modal
      type={MODAL_TYPE.primary}
      heading={t('hycu_dashboard_license_regenerate_heading')}
      onOpenChange={closeModal}
      primaryButton={{
        label: t('hycu_dashboard_regenerate_upload_confirm'),
        loading: isRegeneratePending,
        disabled: !isValid || isRegeneratePending,
        onClick: () => handleSubmit(onSubmit)(),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
      }}
    >
      <Notifications />
      <form className="flex flex-col gap-10">
        <div className="mt-8">
          <>
            <Text preset={TEXT_PRESET.span} className="block mb-3">
              {t('hycu_dashboard_license_regenerate_description')}
            </Text>
            <FileInputField name="license" control={control} />
          </>
        </div>
      </form>
    </Modal>
  );
};

export default RegenerateHycuLicenseModal;

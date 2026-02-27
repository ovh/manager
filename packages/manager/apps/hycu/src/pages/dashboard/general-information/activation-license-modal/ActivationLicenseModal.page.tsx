import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@ovhcloud/ods-react';
import {
  Notifications,
  useNotifications,
  Modal,
  MODAL_TYPE,
  Text,
  TEXT_PRESET,
} from '@ovh-ux/muk';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FileInputField } from '@/components/FileUpload/FileUpload.component';
import { useActivateLicenseHYCUMutation } from '@/hooks/api/license';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

export type ActivationHycuLicenseModalProps = {
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmActivationHycuLicense: () => void;
};

interface FormValues {
  license?: string;
}

export const ActivationHycuLicenseModal: React.FC<ActivationHycuLicenseModalProps> = () => {
  const { serviceName } = useParams();
  const { t } = useTranslation(['hycu/dashboard', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addInfo, addError } = useNotifications();
  const link = useGuideUtils();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitted },
  } = useForm<FormValues>();
  const {
    mutate,
    isPending: isActivationPending,
  } = useActivateLicenseHYCUMutation({
    onSuccess: () => {
      addInfo(t('hycu_dashboard_activation_license_success_message'), true);
      closeModal();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      addError(
        t('hycu_dashboard_activation_license_error_message', {
          error: error.response.data?.message || error.message,
        }),
      );
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (isValid) {
      mutate({ serviceName, licenseContent: data.license });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        dismissible
        type={MODAL_TYPE.primary}
        heading={t('hycu_dashboard_license_activate_heading')}
        onOpenChange={() => closeModal()}
        primaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:confirm`),
          loading: isActivationPending,
          disabled: !isValid || isActivationPending ? true : undefined,
          onClick: () => handleSubmit(onSubmit)(),
        }}
        secondaryButton={{
          label: t(`${NAMESPACES.ACTIONS}:cancel`),
          onClick: () => {
            closeModal();
          },
        }}
      >
        <Notifications />
        <form className="flex flex-col gap-10">
          <div className="mt-8">
            <>
              <Text preset={TEXT_PRESET.paragraph} className="block mb-3">
                {t('hycu_dashboard_license_activate_description')}{' '}
                <Link
                  href={link?.guideLink1}
                  target="blank"
                  referrer-policy="strict-origin-when-cross-origin"
                >
                  {t('hycu_dashboard_license_more_information_link')}
                </Link>
              </Text>
              <FileInputField name="license" control={control} />
            </>
          </div>
        </form>
      </Modal>
    </form>
  );
};

export default ActivationHycuLicenseModal;

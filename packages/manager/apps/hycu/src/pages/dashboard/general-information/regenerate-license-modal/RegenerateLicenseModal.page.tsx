import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
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
  const { t } = useTranslation('hycu/dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addInfo, addError } = useNotifications();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitted },
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
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.primary}
      headline={t('hycu_dashboard_license_regenerate_heading')}
      onOdsModalClose={closeModal}
    >
      <Notifications />
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8">
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              className="block mb-3"
            >
              {t('hycu_dashboard_license_regenerate_description')}
            </OsdsText>
            <FileInputField name="license" control={control} />
          </>
        </div>
        <div className="flex justify-end">
          <OsdsButton
            slot="actions"
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={closeModal}
            inline
          >
            {t('hycu_dashboard_upload_cancel')}
          </OsdsButton>
          <OsdsButton
            data-testid="hycu-dashboard-regenerate-upload-confirm"
            disabled={
              (!isValid && isSubmitted) || isRegeneratePending
                ? true
                : undefined
            }
            slot="actions"
            type={ODS_BUTTON_TYPE.submit}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
          >
            <span slot="start">
              {isRegeneratePending && (
                <OsdsSpinner
                  className="pt-4"
                  inline
                  contrasted
                  size={ODS_SPINNER_SIZE.sm}
                ></OsdsSpinner>
              )}
            </span>
            {t('hycu_dashboard_regenerate_upload_confirm')}
          </OsdsButton>
        </div>
      </form>
    </OsdsModal>
  );
};

export default RegenerateHycuLicenseModal;

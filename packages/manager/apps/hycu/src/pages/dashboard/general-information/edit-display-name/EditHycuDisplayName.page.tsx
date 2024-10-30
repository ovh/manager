import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UpdateIamNameModal,
  useNotifications,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { AxiosError } from 'axios';
import { useInvalidateCacheForALicenseHycu } from '@/hooks/api/license';

export default function EditHycuDisplayNameModal() {
  const { serviceName } = useParams();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('hycu/dashboard');
  const navigate = useNavigate();
  const { data: serviceDetails, isLoading } = useServiceDetails({
    resourceName: serviceName,
  });

  const invalidateCacheForLicense = useInvalidateCacheForALicenseHycu();

  const closeModal = () => {
    navigate('..');
  };

  return (
    <UpdateIamNameModal
      closeModal={closeModal}
      headline={t('hycu_dashboard_update_display_name_modal_headline', {
        serviceName,
      })}
      inputLabel={t('hycu_dashboard_update_display_name_input_label')}
      description={t('hycu_dashboard_update_display_name_description')}
      resourceName={serviceDetails?.data?.resource?.displayName}
      isLoading={isLoading}
      pattern="^(\S| |\-){0,32}$"
      patternMessage={t('hycu_dashboard_update_display_name_pattern_message')}
      onSuccess={() => {
        addSuccess(
          t('hycu_dashboard_update_display_name_success', {
            serviceName,
          }),
        );
        closeModal();
        setTimeout(() => {
          invalidateCacheForLicense(serviceName);
        }, 2000);
      }}
      onError={(requestError: AxiosError) => {
        addError(
          t('hycu_dashboard_edit_modal_error', { error: requestError.message }),
        );
      }}
      defaultValue={serviceDetails?.data?.resource?.displayName}
    />
  );
}

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UpdateIamNameModal,
  useNotifications,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { AxiosError } from 'axios';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useInvalidateCacheForALicenseHycu } from '@/hooks/api/license';

export default function EditHycuDisplayNameModal() {
  const { serviceName } = useParams();
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation([
    'hycu/dashboard',
    NAMESPACES.ACTIONS,
    NAMESPACES.DASHBOARD,
    NAMESPACES.ERROR,
  ]);
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
      headline={t(`${NAMESPACES.ACTIONS}:modify_name`)}
      inputLabel={t(`${NAMESPACES.DASHBOARD}:name`)}
      resourceName={serviceName}
      isLoading={isLoading}
      pattern="^[\x00-\x7F]{1,36}$"
      patternMessage={t('hycu_dashboard_update_display_name_pattern_message')}
      onSuccess={() => {
        addSuccess(
          t(`${NAMESPACES.ACTIONS}:modify_name_success`, {
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
          t(`${NAMESPACES.ERROR}:error_message`, {
            message: requestError.message,
          }),
        );
      }}
      defaultValue={serviceDetails?.data?.resource?.displayName}
    />
  );
}

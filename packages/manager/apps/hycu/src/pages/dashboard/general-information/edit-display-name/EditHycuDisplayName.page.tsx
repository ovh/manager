import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UpdateNameModal, useNotifications } from '@ovh-ux/muk';
import {
  useUpdateServiceDisplayName,
  useServiceDetails,
} from '@ovh-ux/manager-module-common-api';
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
  const {
    data: serviceDetails,
    isLoading: isServiceDetailsLoading,
  } = useServiceDetails({
    resourceName: serviceName,
  });

  const invalidateCacheForLicense = useInvalidateCacheForALicenseHycu();

  const closeModal = () => {
    navigate('..');
  };

  const onSuccess = () => {
    addSuccess(
      t(`${NAMESPACES.ACTIONS}:modify_name_success`, {
        serviceName,
      }),
    );
    closeModal();
    setTimeout(() => {
      invalidateCacheForLicense(serviceName);
    }, 2000);
  };

  const onError = (requestError: AxiosError) => {
    addError(
      t(`${NAMESPACES.ERROR}:error_message`, {
        message: requestError.message,
      }),
    );
  };

  const {
    updateDisplayName,
    isPending: isServiceUpdatePending,
    error,
    isError,
  } = useUpdateServiceDisplayName({
    onSuccess,
    onError,
  });

  return (
    <UpdateNameModal
      onOpenChange={closeModal}
      onClose={closeModal}
      headline={t(`${NAMESPACES.ACTIONS}:modify_name`)}
      inputLabel={t(`${NAMESPACES.DASHBOARD}:name`)}
      error={isError ? error?.response?.data?.message : null}
      updateDisplayName={(displayName) => {
        updateDisplayName({ resourceName: serviceName, displayName });
      }}
      isLoading={isServiceDetailsLoading || isServiceUpdatePending}
      pattern="^[\x00-\x7F]{1,36}$"
      patternMessage={t('hycu_dashboard_update_display_name_pattern_message')}
      defaultValue={serviceDetails?.data?.resource?.displayName}
    />
  );
}

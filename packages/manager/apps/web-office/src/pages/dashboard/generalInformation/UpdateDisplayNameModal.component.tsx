import { useTranslation } from 'react-i18next';
import {
  UpdateNameModal,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useOfficeParentTenant,
  useGenerateUrl,
  useOfficeServiceType,
} from '@/hooks';
import queryClient from '@/queryClient';
import {
  ParentTenantType,
  putParentTenant,
  getOfficeParentTenantQueryKey,
} from '@/api/parentTenant';
import {
  putOfficeLicenseDetails,
  LicenseType,
  getOfficeLicenseDetailsQueryKey,
} from '@/api/license';

export default function UpdateDisplayNameModal() {
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard/general-information', 'common']);
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';
  const { data: getData, refetch } = useOfficeParentTenant();

  const goBackUrl = useGenerateUrl('..', 'path');

  const closeModal = () => {
    navigate(goBackUrl, { replace: true });
  };

  const { addError } = useNotifications();

  const { mutate: editName, isPending } = useMutation({
    mutationFn: isPrepaid
      ? (parentTenantData: Partial<ParentTenantType>) =>
          putParentTenant(serviceName, parentTenantData)
      : (licenseData: Partial<LicenseType>) =>
          putOfficeLicenseDetails(serviceName, licenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: isPrepaid
          ? getOfficeParentTenantQueryKey(serviceName)
          : getOfficeLicenseDetailsQueryKey(serviceName),
      });
      refetch();
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:error_message', {
            error: error.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      closeModal();
    },
  });

  const handleSaveClick = (displayName: string) => {
    editName({ displayName });
  };

  return (
    <UpdateNameModal
      isOpen={true}
      isLoading={isPending}
      closeModal={closeModal}
      headline={t('dashboard_modal_update_headline')}
      description={t('dashboard_modal_update_description')}
      inputLabel={t('dashboard_modal_update_input_label')}
      defaultValue={getData?.displayName}
      confirmButtonLabel={t('common:cta_confirm')}
      cancelButtonLabel={t('common:cta_cancel')}
      updateDisplayName={handleSaveClick}
    />
  );
}

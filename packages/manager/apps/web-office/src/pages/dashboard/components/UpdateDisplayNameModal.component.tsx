import React from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  useOfficeParentTenant,
  UseGenerateUrl,
  useOfficeServiceType,
} from '@/hooks';
import queryClient from '@/queryClient';
import {
  ParentTenantType,
  updateParentTenant,
  getOfficeParentTenantQueryKey,
} from '@/api/parentTenant';
import {
  updateOfficeLicenseDetails,
  LicenseType,
  getOfficeLicenseDetailsQueryKey,
} from '@/api/license';

export default function UpdateDisplayNameModal() {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const { serviceName } = useParams();
  const serviceType = useOfficeServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';
  const { data: getData, refetch } = useOfficeParentTenant();

  const goBackUrl = UseGenerateUrl('..', 'path');
  const closeModal = () => {
    navigate(goBackUrl, { replace: true });
  };
  const { mutate: editName, isPending } = useMutation({
    mutationFn: isPrepaid
      ? (parentTenantData: Partial<ParentTenantType>) =>
          updateParentTenant(serviceName, parentTenantData)
      : (licenseData: Partial<LicenseType>) =>
          updateOfficeLicenseDetails(serviceName, licenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: isPrepaid
          ? getOfficeParentTenantQueryKey(serviceName)
          : getOfficeLicenseDetailsQueryKey(serviceName),
      });
      closeModal();
      refetch();
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
      headline={t('microsoft_office_modal_update_headline')}
      description={t('microsoft_office_modal_update_description')}
      inputLabel={t('microsoft_office_modal_update_input_label')}
      defaultValue={getData?.displayName}
      confirmButtonLabel={t('microsoft_office_modal_update_confirm')}
      cancelButtonLabel={t('microsoft_office_modal_update_cancel')}
      updateDisplayName={handleSaveClick}
    />
  );
}

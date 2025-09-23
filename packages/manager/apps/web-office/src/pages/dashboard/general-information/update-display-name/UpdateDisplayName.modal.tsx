import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { UpdateNameModal, useNotifications } from '@ovh-ux/manager-react-components';

import { putOfficeLicenseDetails } from '@/data/api/license/api';
import { getOfficeLicenseDetailsQueryKey } from '@/data/api/license/key';
import { LicenseType } from '@/data/api/license/type';
import { putParentTenant } from '@/data/api/parent-tenant/api';
import { getOfficeParentTenantQueryKey } from '@/data/api/parent-tenant/key';
import { ParentTenantType } from '@/data/api/parent-tenant/type';
import { useParentTenant } from '@/data/hooks/parent-tenant/useParentTenant';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import queryClient from '@/queryClient';
import { ServiceType } from '@/utils/ServiceType.utils';

export default function UpdateDisplayNameModal() {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'dashboard/general-information',
    'common',
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
  ]);
  const { serviceName } = useParams();
  const serviceType = ServiceType(serviceName);
  const isPrepaid = serviceType === 'prepaid';
  const { data: getData, refetch } = useParentTenant();

  const goBackUrl = useGenerateUrl('..', 'path');

  const closeModal = () => {
    navigate(goBackUrl, { replace: true });
  };

  const { addError } = useNotifications();

  const { mutate: editName, isPending } = useMutation({
    mutationFn: isPrepaid
      ? (parentTenantData: Partial<ParentTenantType>) =>
          putParentTenant(serviceName, parentTenantData)
      : (licenseData: Partial<LicenseType>) => putOfficeLicenseDetails(serviceName, licenseData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          isPrepaid
            ? getOfficeParentTenantQueryKey(serviceName)
            : getOfficeLicenseDetailsQueryKey(serviceName),
          serviceName,
        ],
      });
      void refetch();
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.STATUS}:errorMessage`, {
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
      confirmButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      cancelButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      updateDisplayName={handleSaveClick}
    />
  );
}

import React from 'react';
import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateOkmsName } from '@/data/hooks/useUpdateOkmsName';
import { useOkmsServiceDetails } from '@/data/hooks/useOkmsServiceDetails';

const OkmsNameUpdateModal = () => {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tCredential } = useTranslation(
    'key-management-service/credential',
  );
  const { okmsId } = useParams();
  const { okmsService, isOkmsServiceLoading } = useOkmsServiceDetails(okmsId);
  const navigate = useNavigate();
  const { updateKmsName, isPending, error } = useUpdateOkmsName({
    okmsId,
    onSuccess: () => {
      navigate('..');
    },
  });

  return (
    <UpdateNameModal
      isOpen
      headline={tDashboard('key_management_service_dashboard_modal_title')}
      inputLabel={tCredential(
        'key_management_service_credential_dashboard_name',
      )}
      defaultValue={okmsService.resource.displayName}
      isLoading={isOkmsServiceLoading || isPending}
      error={error?.message}
      closeModal={() => {
        navigate('..');
      }}
      updateDisplayName={(newDisplayName: string) =>
        updateKmsName({ okms: okmsId, displayName: newDisplayName })
      }
    />
  );
};

export default OkmsNameUpdateModal;

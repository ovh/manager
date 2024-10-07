import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateOkmsName } from '@/data/hooks/useUpdateOkmsName';
import { useKMSServiceInfos } from '@/data/hooks/useKMSServiceInfos';

const OkmsNameUpdateModal = () => {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tCredential } = useTranslation(
    'key-management-service/credential',
  );
  const { okmsId } = useParams();
  const { data: okmsServiceInfos, isLoading } = useKMSServiceInfos(okmsId);
  const navigate = useNavigate();
  const { updateKmsName, isPending, error } = useUpdateOkmsName({
    okmsId,
    onSuccess: () => {
      navigate('..');
    },
  });

  return (
    <UpdateNameModal
      headline={tDashboard('key_management_service_dashboard_modal_title')}
      inputLabel={tCredential(
        'key_management_service_credential_dashboard_name',
      )}
      defaultValue={okmsServiceInfos?.data.resource.displayName}
      isLoading={isLoading || isPending}
      error={error?.message}
      closeModal={() => {
        navigate('..');
      }}
      updateDisplayName={(newDisplayName: string) => {
        updateKmsName({ okms: okmsId, displayName: newDisplayName });
      }}
    ></UpdateNameModal>
  );
};

export default OkmsNameUpdateModal;

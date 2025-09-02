import React from 'react';
import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useUpdateOkmsName } from '@/data/hooks/useUpdateOkmsName';
import { KmsDashboardOutletContext } from '../../KmsDashboard.type';

const OkmsNameUpdateModal = () => {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tCredential } = useTranslation(
    'key-management-service/credential',
  );
  const navigate = useNavigate();
  const { okmsId } = useParams();
  const contextValue = useOutletContext<KmsDashboardOutletContext>();
  const { updateKmsName, isPending, error } = useUpdateOkmsName({
    okmsId,
    onSuccess: () => {
      navigate('..');
    },
  });

  if (!contextValue) {
    return null;
  }

  return (
    <UpdateNameModal
      isOpen
      headline={tDashboard('key_management_service_dashboard_modal_title')}
      inputLabel={tCredential(
        'key_management_service_credential_dashboard_name',
      )}
      defaultValue={contextValue.okmsService?.resource?.displayName}
      isLoading={isPending}
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

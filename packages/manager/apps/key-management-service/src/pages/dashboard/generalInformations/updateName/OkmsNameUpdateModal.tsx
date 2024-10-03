import { UpdateNameModal } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateOkmsName } from '@/data/hooks/useUpdateOkmsName';
import { useKMSServiceInfos } from '@/data/hooks/useKMSServiceInfos';

const OkmsNameUpdateModal = () => {
  const { t } = useTranslation('key-management-service/dashboard');
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
      headline={t('key_management_service_dashboard_modal_title')}
      inputLabel={t('key_management_service_dashboard_modal_input_label')}
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

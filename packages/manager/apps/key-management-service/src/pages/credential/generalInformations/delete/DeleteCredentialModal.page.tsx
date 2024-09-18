import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import { useDeleteOkmsCredential } from '@/data/hooks/useDeleteOkmsCredential';
import { ROUTES_URLS } from '@/routes/routes.constants';

const DeleteCredentialPage = () => {
  const navigate = useNavigate();
  const { okmsId, credentialId } = useParams();
  const { t } = useTranslation('key-management-service/credential');

  const { mutate, isPending } = useDeleteOkmsCredential({
    okmsId,
    credentialId,
    onError: () => navigate('..'),
    onSuccess: () => navigate(`/${okmsId}/${ROUTES_URLS.credentials}`),
  });

  const onClose = () => {
    navigate('..');
  };

  const onConfirm = () => {
    mutate();
  };

  return (
    <DeleteModal
      headline={t('key_management_service_credential_delete_modal_headline')}
      deleteInputLabel={t(
        'key_management_service_credential_delete_modal_input_label',
      )}
      closeModal={onClose}
      onConfirmDelete={onConfirm}
      isLoading={isPending}
    />
  );
};

export default DeleteCredentialPage;

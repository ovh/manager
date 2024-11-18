import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import { useDeleteOkmsCredential } from '@/data/hooks/useDeleteOkmsCredential';
import { ROUTES_URLS } from '@/routes/routes.constants';

const DeleteCredentialPage = () => {
  const navigate = useNavigate();
  const { trackPage } = useOvhTracking();
  const { okmsId, credentialId } = useParams();
  const { t } = useTranslation('key-management-service/credential');

  const { mutate, isPending } = useDeleteOkmsCredential({
    okmsId,
    credentialId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_access_certificate',
      });
      navigate(`/${okmsId}/${ROUTES_URLS.credentials}`);
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'delete_access_certificate',
      });
      navigate('..');
    },
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

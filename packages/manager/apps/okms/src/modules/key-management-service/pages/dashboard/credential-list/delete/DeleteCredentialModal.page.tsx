import { useNavigate } from 'react-router-dom';

import { useDeleteOkmsCredential } from '@key-management-service/data/hooks/useDeleteOkmsCredential';
import { useTranslation } from 'react-i18next';

import { DeleteModal } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const DeleteCredentialPage = () => {
  const navigate = useNavigate();
  const { trackPage } = useOkmsTracking();
  const { okmsId, credentialId } = useRequiredParams('okmsId', 'credentialId');
  const { t } = useTranslation('key-management-service/credential');

  const { mutate, isPending } = useDeleteOkmsCredential({
    okmsId,
    credentialId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['delete', 'credential'],
      });
      navigate('..', {
        state: { deletingCredentialId: credentialId },
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['delete', 'credential'],
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
      isOpen
      headline={t('key_management_service_credential_delete_modal_headline')}
      deleteInputLabel={t('key_management_service_credential_delete_modal_input_label')}
      closeModal={onClose}
      onConfirmDelete={onConfirm}
      isLoading={isPending}
    />
  );
};

export default DeleteCredentialPage;

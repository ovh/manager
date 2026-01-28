import { useNavigate } from 'react-router-dom';

import { useDeleteOkmsCredential } from '@key-management-service/data/hooks/useDeleteOkmsCredential';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import { ConfirmationModal } from '@/common/components/confirmation-modal/ConfirmationModal';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

export type CredentialDeleteModalProps = {
  okmsId: string;
  credentialId: string;
  onSuccessNavigation: () => void;
};

export const CredentialDeleteModal = ({
  okmsId,
  credentialId,
  onSuccessNavigation,
}: CredentialDeleteModalProps) => {
  const navigate = useNavigate();
  const { trackPage } = useOkmsTracking();
  const { t } = useTranslation('key-management-service/credential');

  const {
    mutate: deleteCredential,
    isPending,
    error,
  } = useDeleteOkmsCredential({
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['delete', 'credential'],
      });
      onSuccessNavigation();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['delete', 'credential'],
      });
    },
  });

  const onClose = () => {
    navigate('..');
  };

  const onConfirm = () => {
    deleteCredential({ okmsId, credentialId });
  };

  const errorMessage = error
    ? t('key_management_service_credential_delete_error', {
        error: error?.response.data.message,
      })
    : undefined;

  return (
    <ConfirmationModal
      title={t('key_management_service_credential_delete_modal_headline')}
      message={t('key_management_service_credential_delete_modal_description')}
      onDismiss={onClose}
      onConfirm={onConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      isLoading={isPending}
      error={errorMessage}
    />
  );
};

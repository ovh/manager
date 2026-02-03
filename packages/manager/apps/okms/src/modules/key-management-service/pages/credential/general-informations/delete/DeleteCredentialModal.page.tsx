import { useNavigate } from 'react-router-dom';

import { CredentialDeleteModal } from '@key-management-service/components/credential/credential-delete-modal/CredentialDeleteModal';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const DeleteCredentialPage = () => {
  const navigate = useNavigate();
  const { okmsId, credentialId } = useRequiredParams('okmsId', 'credentialId');

  const handleSuccessNavigation = () => {
    navigate(KMS_ROUTES_URLS.credentialListing(okmsId), {
      state: { deletingCredentialId: credentialId },
    });
  };

  return (
    <CredentialDeleteModal
      okmsId={okmsId}
      credentialId={credentialId}
      onSuccessNavigation={handleSuccessNavigation}
    />
  );
};

export default DeleteCredentialPage;

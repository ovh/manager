import { useNavigate } from 'react-router-dom';

import { CredentialDeleteModal } from '@key-management-service/components/credential/credential-delete-modal/CredentialDeleteModal';

import { useRequiredParams } from '@/common/hooks/useRequiredParams';

const DeleteCredentialPage = () => {
  const navigate = useNavigate();
  const { okmsId, credentialId } = useRequiredParams('okmsId', 'credentialId');

  const handleSuccessNavigation = () => {
    navigate('..', {
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

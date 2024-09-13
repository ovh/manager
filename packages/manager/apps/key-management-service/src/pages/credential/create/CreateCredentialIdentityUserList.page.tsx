import React from 'react';
import { useNavigate } from 'react-router-dom';
import IdentityUserListModal from '@/components/Modal/credential/identities/IdentityUserListModal.component';

const CreateCredentialIdentityUserList = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('..');
  };

  return <IdentityUserListModal closeModal={closeModal} />;
};

export default CreateCredentialIdentityUserList;

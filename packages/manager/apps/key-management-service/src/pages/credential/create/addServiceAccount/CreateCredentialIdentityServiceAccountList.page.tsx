import React from 'react';
import { useNavigate } from 'react-router-dom';
import IdentityServiceAccountListModal from '@/components/Modal/credential/identities/IdentityServiceAccountListModal.component';

const CreateCredentialIdentityServiceAccountList = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('..');
  };

  return <IdentityServiceAccountListModal closeModal={closeModal} />;
};

export default CreateCredentialIdentityServiceAccountList;

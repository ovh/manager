import React from 'react';
import { useNavigate } from 'react-router-dom';
import IdentityGroupListModal from '@/components/Modal/credential/identities/IdentityGroupListModal.component';

const CreateCredentialIdentityGroupList = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('..');
  };

  return <IdentityGroupListModal closeModal={closeModal} />;
};

export default CreateCredentialIdentityGroupList;

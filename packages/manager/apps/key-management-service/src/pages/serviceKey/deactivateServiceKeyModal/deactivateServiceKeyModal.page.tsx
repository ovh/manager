import React from 'react';
import { useParams } from 'react-router-dom';
import { ServiceKeyDeactivateModal } from '@/components/serviceKey/modals/ServiceKeyDeactivateModal.component';

const DisableServiceKeyModal = () => {
  const { okmsId, keyId } = useParams();

  return (
    <ServiceKeyDeactivateModal
      okmsId={okmsId}
      keyId={keyId}
    ></ServiceKeyDeactivateModal>
  );
};

export default DisableServiceKeyModal;

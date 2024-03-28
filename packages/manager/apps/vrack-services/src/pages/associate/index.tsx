import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VrackAssociationModal } from '@/components/VrackAssociationModal';

export default function AddVoucherPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return <VrackAssociationModal vrackServicesId={id} closeModal={onClose} />;
}

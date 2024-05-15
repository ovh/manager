import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading/Loading';
import DeleteModal from '@/components/Modal/DeleteModal';
import { useDeleteRancher, useRancher } from '@/hooks/useRancher';

const DeleteRancherModal = () => {
  const { data: selectedRancher, isLoading } = useRancher();
  const navigate = useNavigate();
  const { deleteRancher } = useDeleteRancher();

  if (isLoading) {
    return <Loading />;
  }
  return (
    <DeleteModal
      onClose={() => navigate('..')}
      onDeleteRancher={deleteRancher}
      selectedRancher={selectedRancher}
    />
  );
};

export default DeleteRancherModal;

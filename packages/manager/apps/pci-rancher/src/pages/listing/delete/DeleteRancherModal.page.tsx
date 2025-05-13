import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading/Loading.component';
import DeleteModal from '@/components/Modal/DeleteModal/DeleteModal.component';
import {
  useDeleteRancher,
  useRancher,
} from '@/data/hooks/useRancher/useRancher';

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

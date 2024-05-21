import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RancherService } from '@/api/api.type';
import EditNameModal from '@/components/Modal/EditNameModal';
import { useRancher } from '@/hooks/useRancher';
import useEditRancherName from '@/hooks/useEditRancherName';

export default function EditModal() {
  const { data, refetch } = useRancher();
  const { projectId } = useParams();

  const navigate = useNavigate();

  const rancher = data.data;

  const { mutate: editRancherName } = useEditRancherName({
    projectId: projectId as string,
    rancherId: rancher.id,
    onSuccess: () => refetch(),
    onError: () => true,
  });

  return (
    <div>
      <EditNameModal
        rancher={rancher}
        onEditRancher={(r: RancherService) => editRancherName(r)}
        onClose={() => navigate('..')}
      />
    </div>
  );
}

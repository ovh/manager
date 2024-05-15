import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RancherService } from '@/api/api.type';
import EditNameModal from '@/components/Modal/EditNameModal';
import { useRancher } from '@/hooks/useRancher';
import useEditRancher, { EditAction } from '@/hooks/useEditRancher';

export default function EditModal() {
  const { data: rancher, refetch } = useRancher();
  const { projectId } = useParams();

  const navigate = useNavigate();

  const { mutate: editRancherName } = useEditRancher({
    projectId: projectId as string,
    rancherId: rancher.id,
    onSuccess: () => refetch(),
    onError: () => true,
  });

  return (
    <div>
      <EditNameModal
        rancher={rancher}
        onEditRancher={(r: RancherService) =>
          editRancherName({ rancher: r, editAction: EditAction.EditName })
        }
        onClose={() => navigate('..')}
      />
    </div>
  );
}

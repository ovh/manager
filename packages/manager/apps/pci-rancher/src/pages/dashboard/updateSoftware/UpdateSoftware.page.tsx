import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEditRancher, { EditAction } from '@/hooks/useEditRancher';
import { useRancher } from '@/hooks/useRancher';
import useVersions from '@/hooks/useVersions';
import { getRancherByIdUrl } from '@/utils/route';
import UpdateSoftware from './UpdateSoftware.component';

const UpdateSoftwarePage = () => {
  const { data: rancher } = useRancher();
  const { projectId } = useParams();
  const { data: versions } = useVersions();
  const { mutate, isPending } = useEditRancher({
    projectId,
    rancherId: rancher?.id,
    onSuccess: () => {},
    onError: () => {},
  });
  const navigate = useNavigate();

  const onClickUpdate = (version: string) => {
    mutate({
      rancher: {
        targetSpec: {
          ...rancher.targetSpec,
          version,
        },
      },
      editAction: EditAction.UpdateSoftware,
    });
    navigate(getRancherByIdUrl(projectId, rancher?.id));
  };

  return (
    <UpdateSoftware
      versions={versions}
      rancher={rancher}
      onClickUpdate={onClickUpdate}
      isUpdatePending={isPending}
    />
  );
};

export default UpdateSoftwarePage;

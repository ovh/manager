import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEditRancher, {
  EditAction,
} from '@/data/hooks/useEditRancher/useEditRancher';
import {
  useRancher,
  useRancherVersionsCapabilities,
} from '@/data/hooks/useRancher/useRancher';
import { getRancherByIdUrl } from '@/utils/route';
import UpdateSoftware from './UpdateSoftware.component';
import { getVersion } from '@/utils/rancher';
import useVersions from '@/data/hooks/useVersions/useVersions';
import Loading from '@/components/Loading/Loading.component';

const UpdateSoftwarePage = () => {
  const { data: rancher } = useRancher();
  const { projectId } = useParams();
  const { data: allVersions } = useVersions();

  const {
    data: versions,
    isLoading: isNewVersionsLoading,
  } = useRancherVersionsCapabilities();

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

  const currentRancherVersion = getVersion(rancher);
  const currentRancherVersionDetails = allVersions?.find(
    (version) => version.name === currentRancherVersion,
  );
  if (isNewVersionsLoading) {
    return <Loading />;
  }

  return (
    <UpdateSoftware
      versions={versions}
      rancher={rancher}
      onClickUpdate={onClickUpdate}
      isUpdatePending={isPending}
      currentVersionDetails={currentRancherVersionDetails}
    />
  );
};

export default UpdateSoftwarePage;

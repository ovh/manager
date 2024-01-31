import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  editRancherService,
  patchRancherServiceQueryKey,
} from '../api/GET/apiv2/services';
import { RancherService } from '../api/api.type';

const useEditRancherName = ({
  rancherId,
  projectId,
}: {
  rancherId: string;
  projectId: string;
}) => {
  const [
    editNameResponse,
    setEditNameResponse,
  ] = useState<ODS_MESSAGE_TYPE | null>(null);
  const { mutate: editRancherName } = useMutation({
    mutationFn: (rancherUpdated: RancherService) =>
      editRancherService({
        rancherId,
        projectId: projectId as string,
        rancher: rancherUpdated,
      }),
    onSuccess: () => {
      setEditNameResponse(ODS_MESSAGE_TYPE.success);
    },
    onError: () => {
      setEditNameResponse(ODS_MESSAGE_TYPE.error);
    },
    mutationKey: patchRancherServiceQueryKey(rancherId),
  });

  return { editRancherName, editNameResponse };
};

export default useEditRancherName;

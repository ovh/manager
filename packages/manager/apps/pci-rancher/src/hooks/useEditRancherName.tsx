import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  editRancherService,
  patchRancherServiceQueryKey,
} from '../api/apiv2/services';
import { RancherService } from '../api/api.type';

const useEditRancherName = ({
  rancherId,
  projectId,
}: {
  rancherId: string;
  projectId: string;
}) => {
  const [editNameResponseType, setEditNameResponseType] = useState<
    ODS_MESSAGE_TYPE.success | ODS_MESSAGE_TYPE.error | null
  >(null);
  const { mutate: editRancherName } = useMutation({
    mutationFn: (rancherUpdated: RancherService) =>
      editRancherService({
        rancherId,
        projectId,
        rancher: rancherUpdated,
      }),
    onSuccess: () => setEditNameResponseType(ODS_MESSAGE_TYPE.success),
    onError: () => setEditNameResponseType(ODS_MESSAGE_TYPE.error),
    mutationKey: patchRancherServiceQueryKey(rancherId),
  });

  return { editRancherName, editNameResponseType };
};

export default useEditRancherName;

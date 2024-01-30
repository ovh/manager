import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  generateAccessRancherService,
  postRancherServiceQueryKey,
} from '../api/GET/apiv2/services';

export type AccessDetail = {
  username: string;
  password: string;
} | null;
const useGenerateAccessDetail = ({
  rancherId,
  projectId,
}: {
  rancherId: string;
  projectId: string;
}) => {
  const [accessDetail, setAccessDetail] = useState<AccessDetail>(null);
  const [hasErrorAccessDetail, setErrorAccesDetail] = useState<boolean>(false);

  const { mutate: generateAccesDetail } = useMutation({
    mutationFn: () =>
      generateAccessRancherService({
        rancherId,
        projectId,
      }),
    onSuccess: (response) => setAccessDetail(response?.data),
    onError: () => setErrorAccesDetail(true),
    mutationKey: postRancherServiceQueryKey(rancherId),
  });

  return { generateAccesDetail, accessDetail, hasErrorAccessDetail };
};

export default useGenerateAccessDetail;

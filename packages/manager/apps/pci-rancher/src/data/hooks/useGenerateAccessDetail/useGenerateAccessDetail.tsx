import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  generateAccessRancherService,
  postRancherServiceQueryKey,
} from '../../api/services';

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

  const { mutate: generateAccesDetail, reset } = useMutation({
    mutationFn: () => {
      setErrorAccesDetail(false);
      return generateAccessRancherService({
        rancherId,
        projectId,
      });
    },
    onSuccess: (response) => setAccessDetail(response?.data),
    mutationKey: postRancherServiceQueryKey(rancherId),
  });

  const onReset = () => {
    reset();
    setAccessDetail(null);
  };

  return {
    generateAccesDetail,
    accessDetail,
    hasErrorAccessDetail,
    setAccessDetail,
    onReset,
  };
};

export default useGenerateAccessDetail;

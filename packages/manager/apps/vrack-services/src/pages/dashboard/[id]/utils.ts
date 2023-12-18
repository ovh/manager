/* eslint-disable import/prefer-default-export */
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getVrackServicesResourceList,
  getVrackServicesResourceListQueryKey,
} from '@/api';

export const useVrackService = () => {
  const { id } = useParams();

  const result = useQuery({
    queryKey: getVrackServicesResourceListQueryKey,
    queryFn: () => getVrackServicesResourceList(),
  });

  return { ...result, data: result.data?.data?.find((vs) => vs.id === id) };
};

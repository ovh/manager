import { useQuery } from '@tanstack/react-query';

import { getCloudSchema } from '../data/cloud';

export const useGetCloudSchema = () =>
  useQuery({
    queryKey: ['cloud-schema'],
    queryFn: getCloudSchema,
  });

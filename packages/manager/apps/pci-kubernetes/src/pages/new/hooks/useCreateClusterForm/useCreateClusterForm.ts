import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TCreateClusterSchema, createClusterSchema } from '../../CreateClusterForm.schema';

const createClusterResolver = zodResolver(createClusterSchema);

export const useCreateClusterForm = () => {
  return useForm<TCreateClusterSchema>({
    mode: 'onChange',
    resolver: createClusterResolver,
    defaultValues: {
      name: 'DEFAULT_CLUSTER_NAME',
    },
  });
};

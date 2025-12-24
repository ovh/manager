import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TCreateClusterSchema, createClusterSchema } from './CreateClusterForm.schema';

const resolver = zodResolver(createClusterSchema);

export const useCreateClusterForm = () => {
  return useForm<TCreateClusterSchema>({
    mode: 'onChange',
    resolver,
    defaultValues: {
      name: 'DEFAULT_CLUSTER_NAME',
    },
  });
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { generateName } from '@/helpers/form/nameGenerator';

import { TCreateClusterSchema, createClusterSchema } from '../../CreateClusterForm.schema';

const createClusterResolver = zodResolver(createClusterSchema);

export const useCreateClusterForm = () => {
  const defaultName = `MKS-${generateName()}`;

  return useForm<TCreateClusterSchema>({
    mode: 'onChange',
    resolver: createClusterResolver,
    defaultValues: {
      name: defaultName,
    },
  });
};

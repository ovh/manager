import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  createShareSchema,
  CreateShareFormValues,
} from '../schema/CreateShare.schema';

export const useCreateShareForm = () => {
  return useForm<CreateShareFormValues>({
    resolver: zodResolver(createShareSchema),
    defaultValues: {
      name: '',
      deploymentModes: [],
      continent: '',
      city: '',
      dataCenter: '',
      availabilityZone: '',
    },
    mode: 'onChange',
  });
};


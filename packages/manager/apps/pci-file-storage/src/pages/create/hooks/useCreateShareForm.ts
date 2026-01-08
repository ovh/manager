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
      deploymentMode: '',
      continent: '',
      macroRegion: '',
      microRegion: '',
      availabilityZone: '',
    },
    mode: 'onChange',
  });
};


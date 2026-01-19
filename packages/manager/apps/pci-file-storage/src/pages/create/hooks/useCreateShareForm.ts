import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CreateShareFormValues, createShareSchema } from '../schema/CreateShare.schema';

export const useCreateShareForm = () => {
  return useForm<CreateShareFormValues>({
    resolver: zodResolver(createShareSchema),
    defaultValues: {
      shareData: {
        name: '',
        microRegion: '',
      },
      deploymentModes: ['region', 'region-3-az'],
      continent: 'all',
      macroRegion: '',
    },
    mode: 'onChange',
  });
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TRegionData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { selectLocalizations } from '@/pages/create/view-model/shareCatalog.view-model';

import { CreateShareFormValues, createShareSchema } from '../schema/CreateShare.schema';

export const useCreateShareForm = () => {
  const { data: localizations = [] } = useShareCatalog<TRegionData[]>({
    select: selectLocalizations({ deploymentModes: ['region', 'region-3-az'], continentId: 'all' }),
  });

  return useForm<CreateShareFormValues>({
    resolver: zodResolver(createShareSchema),
    defaultValues: {
      shareData: {
        name: '',
        microRegion: localizations[0]?.microRegion ?? '',
      },
      deploymentModes: ['region', 'region-3-az'],
      continent: 'all',
      macroRegion: localizations[0]?.macroRegion ?? '',
      availabilityZone: null,
    },
    mode: 'onChange',
  });
};

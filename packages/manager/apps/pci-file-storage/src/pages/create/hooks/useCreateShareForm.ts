import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { TRegionData, TShareSpecData } from '@/adapters/catalog/left/shareCatalog.data';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { generateAutoName } from '@/pages/create/view-model/network.view-model';
import {
  selectLocalizations,
  selectShareSpecs,
} from '@/pages/create/view-model/shareCatalog.view-model';

import { CreateShareFormValues, createShareSchema } from '../schema/CreateShare.schema';

export const useCreateShareForm = () => {
  const { data: localizations = [] } = useShareCatalog<TRegionData[]>({
    select: selectLocalizations({ deploymentModes: ['region', 'region-3-az'], continentId: 'all' }),
  });

  const firstAvailableLocation = localizations.find((loc) => loc.available);
  const defaultMicroRegion = firstAvailableLocation?.microRegion ?? '';
  const defaultMacroRegion = firstAvailableLocation?.macroRegion ?? '';

  const { data: shareOptions = [] } = useShareCatalog<TShareSpecData[]>({
    select: selectShareSpecs(defaultMicroRegion),
  });

  const defaultShareName = shareOptions[0]?.name ?? '';
  const defaultSize = shareOptions[0]?.capacityMin ?? 150;
  const defaultName = generateAutoName(defaultShareName);

  return useForm<CreateShareFormValues>({
    resolver: zodResolver(createShareSchema),
    defaultValues: {
      shareData: {
        name: defaultName,
        microRegion: defaultMicroRegion,
        specName: defaultShareName,
        size: defaultSize,
        privateNetworkId: undefined,
      },
      deploymentModes: ['region', 'region-3-az'],
      continent: 'all',
      macroRegion: defaultMacroRegion,
      availabilityZone: null,
    },
    mode: 'onChange',
  });
};

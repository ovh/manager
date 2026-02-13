import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { generateAutoName } from '@/pages/create/view-model/network.view-model';
import {
  TDeploymentModeData,
  TShareSpecData,
} from '@/pages/create/view-model/shareCatalog.view-model';
import {
  TFirstAvailableLocation,
  selectDeploymentModes,
  selectFirstAvailableLocation,
  selectShareSpecs,
} from '@/pages/create/view-model/shareCatalog.view-model';

import { CreateShareFormValues, createShareSchema } from '../schema/CreateShare.schema';

const getDefaultDeploymentModes = (
  deploymentModesFromCatalog: { mode: TDeploymentModeData }[] | undefined,
): TDeploymentModeData[] => {
  const modes = deploymentModesFromCatalog?.map((m) => m.mode) ?? [];
  const hasRegion = modes.includes('region');
  const hasRegion3Az = modes.includes('region-3-az');
  const hasLocalzone = modes.includes('localzone');

  const result: TDeploymentModeData[] = [];
  if (hasRegion) result.push('region');
  if (hasRegion3Az) result.push('region-3-az');
  if (hasLocalzone && !hasRegion && !hasRegion3Az) result.push('localzone');
  return result;
};

export const useCreateShareForm = () => {
  const { data: deploymentModesFromCatalog } = useShareCatalog({
    select: selectDeploymentModes,
  });

  const defaultDeploymentModes = getDefaultDeploymentModes(deploymentModesFromCatalog);

  const { data: firstAvailableLocation } = useShareCatalog<TFirstAvailableLocation | undefined>({
    select: selectFirstAvailableLocation({
      deploymentModes: defaultDeploymentModes ?? [],
      continentId: 'all',
    }),
  });

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
        privateNetworkId: '',
      },
      deploymentModes: defaultDeploymentModes ?? [],
      continent: 'all',
      macroRegion: defaultMacroRegion,
      availabilityZone: null,
    },
    mode: 'onChange',
  });
};

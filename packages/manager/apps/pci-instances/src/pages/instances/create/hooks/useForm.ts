import { deps } from '@/deps/deps';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { nameDefaultValue } from '../components/Name.component';
import { quantityDefaultValue } from '../components/QuantitySelector.component';
import { instanceCreationSchema } from '../CreateInstance.page';
import { selectContinent } from '../view-models/continentsViewModel';
import { selectDeploymentModes } from '../view-models/deploymentModeViewModel';
import { selectLocalizations } from '../view-models/localizationsViewModel';
import { TDeploymentMode } from '@/types/instance/common.type';
import { mockedFlavorCategories } from '@/__mocks__/instance/constants';

export const useForm = (projectId: string) => {
  const deploymentModes = selectDeploymentModes(deps)(projectId);
  const deploymentModesDefaultValue: TDeploymentMode[] = [
    deploymentModes[0]!.mode,
  ];

  const continents = selectContinent(deps)(
    projectId,
    deploymentModesDefaultValue,
  );

  const continentDefaultValue = continents[0]!.value;

  const localizations = selectLocalizations(deps)(
    projectId,
    deploymentModesDefaultValue,
    continentDefaultValue,
  );

  const macroRegionDefaultValue = localizations[0]!.region;

  const microRegionDefaultValue =
    localizations[0]!.microRegions[0]?.name ?? null;

  const flavorCategoryDefaultValue = mockedFlavorCategories[0]?.name ?? '';

  const flavorTypeDefaultValue =
    mockedFlavorCategories.find(
      ({ name }) => name === flavorCategoryDefaultValue,
    )?.type[0]?.name ?? '';

  const availabilityZoneDefaultValue =
    localizations[0]!.microRegions[0]?.availabilityZones[0] ?? null;

  const formMethods = useReactHookForm({
    resolver: zodResolver(instanceCreationSchema),
    values: {
      name: nameDefaultValue,
      quantity: quantityDefaultValue,
      deploymentModes: deploymentModesDefaultValue,
      continent: continentDefaultValue,
      flavorCategory: flavorCategoryDefaultValue,
      flavorType: flavorTypeDefaultValue,
      macroRegion: macroRegionDefaultValue,
      microRegion: microRegionDefaultValue,
      availabilityZone: availabilityZoneDefaultValue,
    },
    mode: 'onChange',
  });

  return formMethods;
};

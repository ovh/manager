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
import {
  selectCategories,
  selectTypes,
} from '../view-models/categoriesTypesViewModel';

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

  const { localizations } = selectLocalizations(deps)(
    projectId,
    deploymentModesDefaultValue,
    continentDefaultValue,
    'total',
  );

  const macroRegionDefaultValue = localizations[0]!.macroRegion;

  const microRegionDefaultValue =
    localizations[0]!.microRegions[0]?.name ?? null;

  const categories = selectCategories(deps)(projectId);

  const flavorCategoryDefaultValue = categories[0]?.value ?? null;

  const flavorTypeDefaultValue =
    selectTypes(deps)(projectId, flavorCategoryDefaultValue)[0]?.value ?? null;

  const availabilityZoneDefaultValue = null;

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

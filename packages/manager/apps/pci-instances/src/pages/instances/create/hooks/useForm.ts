import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { deps } from '@/deps/deps';
import { nameDefaultValue } from '../components/Name.component';
import { quantityDefaultValue } from '../components/QuantitySelector.component';
import { instanceCreationSchema } from '../CreateInstance.page';
import { selectContinent } from '../view-models/continentsViewModel';
import { selectLocalizations } from '../view-models/localizationsViewModel';
import { TDeploymentMode } from '@/types/instance/common.type';
import {
  selectCategories,
  selectTypes,
} from '../view-models/categoriesTypesViewModel';
import { mockedDistributionImageType } from '@/__mocks__/instance/constants';
import { selectFlavors } from '../view-models/flavorsViewModel';

// eslint-disable-next-line max-lines-per-function
export const useForm = (projectId: string) => {
  const deploymentModesDefaultValue: TDeploymentMode[] = [
    'region',
    'region-3-az',
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
    null,
  );

  const macroRegionDefaultValue = localizations[0]!.macroRegion;

  const microRegionDefaultValue =
    localizations[0]!.microRegions[0]?.name ?? null;

  const categories = selectCategories(deps)(projectId);

  const flavorCategoryDefaultValue = categories[0]?.value ?? null;

  const flavorTypeDefaultValue =
    selectTypes(deps)(projectId, flavorCategoryDefaultValue)[0]?.value ?? null;

  const flavorIdDefaultValue =
    selectFlavors(deps)(
      projectId,
      flavorTypeDefaultValue,
      microRegionDefaultValue,
    )[0]?.id ?? null;
  console.log('🚀 ~ useForm ~ flavorIdDefaultValue:', flavorIdDefaultValue);

  const availabilityZoneDefaultValue = null;

  const distributionImageTypeDefaultValue =
    mockedDistributionImageType[0]?.value ?? null;

  const formMethods = useReactHookForm({
    resolver: zodResolver(instanceCreationSchema),
    values: {
      name: nameDefaultValue,
      quantity: quantityDefaultValue,
      deploymentModes: deploymentModesDefaultValue,
      continent: continentDefaultValue,
      flavorCategory: flavorCategoryDefaultValue,
      flavorType: flavorTypeDefaultValue,
      flavorId: flavorIdDefaultValue,
      macroRegion: macroRegionDefaultValue,
      microRegion: microRegionDefaultValue,
      availabilityZone: availabilityZoneDefaultValue,
      distributionImageType: distributionImageTypeDefaultValue,
    },
    mode: 'onChange',
  });

  return formMethods;
};

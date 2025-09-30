import { deps } from '@/deps/deps';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { nameDefaultValue } from '../components/Name.component';
import { quantityDefaultValue } from '../components/QuantitySelector.component';
import { instanceCreationSchema } from '../CreateInstance.page';
import { selectContinent } from '../view-models/selectContinents';
import { selectDeploymentModes } from '../view-models/selectDeploymentMode';
import { selectLocalizations } from '../view-models/selectLocalizations';
import { TDeploymentMode } from '@/types/instance/common.type';
import { mockedFlavorCategories } from '@/__mocks__/instance/constants';

export const useForm = (projectId: string) => {
  const deploymentModes = selectDeploymentModes(deps)(projectId);
  const deploymentModesDefaultValue: TDeploymentMode[] = [
    deploymentModes[0]?.mode ?? 'region-3-az',
  ];

  const continents = selectContinent(deps)(
    projectId,
    deploymentModesDefaultValue,
  );

  const continentDefaultValue = continents[0]?.value ?? 'all';

  const localizations = selectLocalizations(deps)(
    projectId,
    deploymentModesDefaultValue,
    continentDefaultValue,
  );

  const localizationDefaultValue = localizations[0]?.region ?? 'EU-WEST-PAR';

  const flavorCategoryDefaultValue = mockedFlavorCategories[0]?.name ?? '';

  const flavorTypeDefaultValue =
    mockedFlavorCategories.find(
      ({ name }) => name === flavorCategoryDefaultValue,
    )?.type[0]?.name ?? '';

  const formMethods = useReactHookForm({
    resolver: zodResolver(instanceCreationSchema),
    values: {
      name: nameDefaultValue,
      quantity: quantityDefaultValue,
      deploymentModes: deploymentModesDefaultValue,
      region: localizationDefaultValue,
      continent: continentDefaultValue,
      flavorCategory: flavorCategoryDefaultValue,
      flavorType: flavorTypeDefaultValue,
    },
    mode: 'onChange',
  });

  return formMethods;
};

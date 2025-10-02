import { deps } from '@/deps/deps';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { nameDefaultValue } from '../components/Name.component';
import { quantityDefaultValue } from '../components/QuantitySelector.component';
import { instanceCreationSchema } from '../CreateInstance.page';
import { selectContinentData } from '../view-models/selectContinents';
import { selectDeploymentModes } from '../view-models/selectDeploymentMode';
import { selectLocalizations } from '../view-models/selectLocalizations';
import { TDeploymentMode } from '@/types/instance/common.type';

export const useGetForm = (projectId: string) => {
  const deploymentModes = selectDeploymentModes(deps)(projectId);
  const deploymentModesDefaultValue: TDeploymentMode[] = deploymentModes[0]
    ? [deploymentModes[0].mode]
    : ['region-3-az'];

  const continents = selectContinentData(deps)(
    projectId,
    deploymentModesDefaultValue,
  );

  const continentDefaultValue = continents[0]
    ? continents[0].value
    : 'western_europe';

  const localizations = selectLocalizations(deps)(
    projectId,
    deploymentModesDefaultValue,
    continentDefaultValue,
  );

  const localizationDefaultValue = localizations[0]
    ? localizations[0].region
    : 'EU-WEST-PAR';

  const formMethods = useForm({
    resolver: zodResolver(instanceCreationSchema),
    values: {
      name: nameDefaultValue,
      quantity: quantityDefaultValue,
      deploymentModes: deploymentModesDefaultValue,
      region: localizationDefaultValue,
      continent: continentDefaultValue,
    },
    mode: 'onChange',
  });

  return formMethods;
};

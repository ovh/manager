import { TMacroRegion } from '@/domain/entities/regions';

import { TCreateClusterSchema, createClusterFormContinentCodes } from '../CreateClusterForm.schema';

export type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['location']['continent'];
};

const ALL_CONTINENT_OPTION: ContinentOption = {
  labelKey: 'common_continent_label_ALL',
  continentCode: 'ALL',
};

export const selectAvailableContinentOptions = (
  regions?: Array<TMacroRegion>,
): Array<ContinentOption> => {
  if (!regions || regions.length === 0) {
    return [ALL_CONTINENT_OPTION];
  }

  const uniqueContinents = new Set(regions.map((region) => region.continentCode));

  const options: Array<ContinentOption> = [ALL_CONTINENT_OPTION];

  createClusterFormContinentCodes.forEach((code) => {
    if (code !== 'ALL' && uniqueContinents.has(code)) {
      options.push({
        labelKey: `common_continent_label_${code}`,
        continentCode: code,
      });
    }
  });

  return options;
};

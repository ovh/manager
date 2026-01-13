import { TCreateClusterSchema, createClusterFormContinentCodes } from '../CreateClusterForm.schema';

type ContinentOption = {
  labelKey: string;
  continentCode: TCreateClusterSchema['continent'];
};

// TODO (TAPC-5549): Make this a real select based on API data
export const selectContinentOptions = (): Array<ContinentOption> => {
  return createClusterFormContinentCodes.map((code) => ({
    labelKey: `common_continent_label_${code}`,
    continentCode: code,
  }));
};

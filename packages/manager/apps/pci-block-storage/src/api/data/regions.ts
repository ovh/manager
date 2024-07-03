import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  name: string;
  type: string;
  status: string;
  continentCode: string;
  services: {
    name: string;
    status: string;
    endpoint: string;
  }[];
  datacenterLocation: string;
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const getMacroRegion = (regionName: string) => {
  const localZonePattern = /^lz/i;
  let macro: RegExpExecArray;
  if (
    localZonePattern.test(
      regionName
        .split('-')
        ?.slice(2)
        ?.join('-'),
    )
  ) {
    macro = /\D{2,3}/.exec(
      regionName
        .split('-')
        ?.slice(3)
        ?.join('-'),
    );
  } else {
    macro = /\D{2,3}/.exec(regionName);
  }
  return macro ? macro[0].replace('-', '').toUpperCase() : '';
};

import { v6 } from '@ovh-ux/manager-core-api';
import { aggregateBySpecificKey } from '@/helpers';
import { FilterRestrictionsServer, TIPRestrictionsDefault } from '@/types';

const baseUrl = (projectId: string, registryId: string) =>
  `/cloud/project/${projectId}/containerRegistry/${registryId}/ipRestrictions`;

export const fetchV6URl = async (
  url: string,
): Promise<TIPRestrictionsDefault[]> => {
  const { data } = await v6.get(url);
  return data;
};

export const getIpRestrictions = async (
  projectId: string,
  registryId: string,
  authorization: FilterRestrictionsServer[],
) => {
  const data = await Promise.all(
    authorization.map(async (auth) => {
      const getDataServer = await fetchV6URl(
        `${baseUrl(projectId, registryId)}/${auth}`,
      );
      return getDataServer.map((ipBlocks) => ({
        ...ipBlocks,
        authorization: auth,
      }));
    }),
  );
  if (data.length) {
    const newData = data.flat().map((restriction) => ({
      ...restriction,
      draft: false,
      checked: false,
      id: restriction.ipBlock,
    }));
    return aggregateBySpecificKey(newData, 'ipBlock', 'authorization');
  }
  return [];
};

// Function to iterate through entries and handle each authorization
export const processIpBlock = async (
  projectId: string,
  registryId: string,
  authorization: FilterRestrictionsServer,
  values: TIPRestrictionsDefault[],
  action: 'DELETE' | 'REPLACE',
) => {
  const dataRegistry = await fetchV6URl(
    `${baseUrl(projectId, registryId)}/${authorization}`,
  );

  values.forEach((value) => {
    const blockIndex = dataRegistry.findIndex(
      (item) => value.ipBlock === item.ipBlock,
    );

    if (blockIndex !== -1) {
      if (action === 'DELETE') {
        dataRegistry.splice(blockIndex, 1);
      }
      if (action === 'REPLACE') {
        dataRegistry[blockIndex] = value;
      }
    } else {
      dataRegistry.push(value);
    }
  });

  return v6.put(
    `${baseUrl(projectId, registryId)}/${authorization}`,
    dataRegistry,
  );
};

export const updateIpRestriction = async (
  projectId: string,
  registryId: string,
  cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>,
  action: 'DELETE' | 'REPLACE',
) => {
  const entries = Object.entries(cidrToUpdate);
  const promises = entries.map(([authorization, values]) =>
    processIpBlock(projectId, registryId, authorization, values, action),
  );
  return Promise.all(promises);
};

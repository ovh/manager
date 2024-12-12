import { v6 } from '@ovh-ux/manager-core-api';
import { aggregateBySpecificKey } from '@/helpers';
import {
  FilterRestrictionsServer,
  TIPRestrictions,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';

const baseUrl = (projectId: string, registryId: string) =>
  `/cloud/project/${projectId}/containerRegistry/${registryId}/ipRestrictions`;

export const fetchV6URl = async (url: string): Promise<TIPRestrictions[]> => {
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
  action:
    | TIPRestrictionsMethodEnum.DELETE
    | TIPRestrictionsMethodEnum.REPLACE
    | TIPRestrictionsMethodEnum.ADD,
) => {
  const dataRegistry = await fetchV6URl(
    `${baseUrl(projectId, registryId)}/${authorization}`,
  );

  values.forEach((value) => {
    const blockIndex = dataRegistry.findIndex(
      (item) => value.ipBlock === item.ipBlock,
    );

    if (blockIndex !== -1) {
      if (action === TIPRestrictionsMethodEnum.DELETE) {
        dataRegistry.splice(blockIndex, 1);
      }
      if (action === TIPRestrictionsMethodEnum.REPLACE) {
        dataRegistry[blockIndex] = value;
      }
    } else {
      dataRegistry.push(value);
    }
  });

  return v6.put(
    `${baseUrl(projectId, registryId)}/${authorization}`,
    dataRegistry.map((registry) => ({
      ipBlock: registry.ipBlock,
      description: registry.description,
    })),
  );
};

export const updateIpRestriction = async (
  projectId: string,
  registryId: string,
  cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>,
  action:
    | TIPRestrictionsMethodEnum.DELETE
    | TIPRestrictionsMethodEnum.REPLACE
    | TIPRestrictionsMethodEnum.ADD,
) => {
  const entries = Object.entries(cidrToUpdate);
  const promises = entries.map(([authorization, values]) =>
    processIpBlock(
      projectId,
      registryId,
      authorization as FilterRestrictionsServer,
      values,
      action,
    ),
  );
  return Promise.all(promises);
};

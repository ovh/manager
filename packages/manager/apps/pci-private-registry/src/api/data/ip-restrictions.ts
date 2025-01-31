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

/**
 * Aggregates IP restrictions data from multiple authorizations by calling APIs and combining the results.
 *
 * This function fetches IP restriction data for each provided authorization type, enriches it with metadata,
 * and aggregates the data by a specific key (`ipBlock` and `authorization`).
 *
 * @param projectId - The identifier of the project.
 * @param registryId - The identifier of the registry.
 * @param authorization - A list of authorization types to fetch IP restrictions for.
 * @returns - A promise that resolves to an array of aggregated IP restrictions,
 * enriched with metadata such as `draft`, `checked`, and `id`. Returns an empty array if no data is fetched.
 */
export const getIpRestrictions = async (
  projectId: string,
  registryId: string,
  authorization: FilterRestrictionsServer[],
) => {
  const data = await Promise.all(
    authorization.map(async (auth) => {
      const getListRestrictions = await fetchV6URl(
        `${baseUrl(projectId, registryId)}/${auth}`,
      );
      return getListRestrictions.map((ipBlocks) => ({
        ...ipBlocks,
        authorization: auth,
      }));
    }),
  );

  return aggregateBySpecificKey(data.flat(), 'ipBlock', 'authorization');
};

// Function to iterate through entries and handle each authorization
export const processIpBlock = async ({
  projectId,
  registryId,
  authorization,
  values,
  action,
}: {
  projectId: string;
  registryId: string;
  authorization: FilterRestrictionsServer;
  values: TIPRestrictionsDefault[];
  action: TIPRestrictionsMethodEnum;
}) => {
  const dataRegistry = await fetchV6URl(
    `${baseUrl(projectId, registryId)}/${authorization}`,
  );

  const updatedRegistry = values.reduce((acc, value) => {
    const blockIndex = acc.findIndex((item) => value.ipBlock === item.ipBlock);

    switch (action) {
      case TIPRestrictionsMethodEnum.DELETE:
        return blockIndex !== -1
          ? acc.filter((_, index) => index !== blockIndex)
          : acc;

      case TIPRestrictionsMethodEnum.REPLACE:
        return blockIndex !== -1
          ? acc.map((item, index) => (index === blockIndex ? value : item))
          : [...acc, value];

      case TIPRestrictionsMethodEnum.ADD:
        return blockIndex === -1 ? [...acc, value] : acc;

      default:
        return acc;
    }
  }, dataRegistry);

  return v6.put(
    `${baseUrl(projectId, registryId)}/${authorization}`,
    updatedRegistry.map((registry) => ({
      ipBlock: registry.ipBlock,
      description: registry.description,
    })),
  );
};

export const updateIpRestriction = async (
  projectId: string,
  registryId: string,
  cidrToUpdate: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>,
  action: TIPRestrictionsMethodEnum,
) => {
  const entries = Object.entries(cidrToUpdate);

  // This function is used to delete the object inside authorisation array if REPLACE action is used
  const firstIpBlock = Object.values(cidrToUpdate)
    .flat()
    .find((item) => item);

  const promises = entries.map(([authorization, values]) =>
    processIpBlock({
      projectId,
      registryId,
      authorization: authorization as FilterRestrictionsServer,
      values: firstIpBlock && values.length === 0 ? [firstIpBlock] : values,
      action:
        firstIpBlock && values.length === 0
          ? TIPRestrictionsMethodEnum.DELETE
          : action,
    }),
  );
  return Promise.all(promises);
};

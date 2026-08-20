import { ApiError, v2 } from '@ovh-ux/manager-core-api';
import { DomainOperationsEnum, foaScheduledTaskStatus } from '@/constants';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { TDomainResource, TDomainTaskV2, TFoa } from '@/types';

const getTaskPath = (domainName: string) =>
  `domain/name/${encodeURIComponent(domainName)}/task`;

/**
 * The FOA reads all carry a live verdict — the registry policy on the
 * domain, the state of the trade task, the answers of the holders. None of
 * them may be served from a cached object list, so every GET asks for a
 * fresh one, as the datagrids do through their disableCache option.
 */
const noCacheHeaders = { headers: { Pragma: 'no-cache' } };

/**
 * Get the APIv2 domain resource : its currentState carries the
 * designatedAgentAllowed verdict of the registry
 */
export const getDomainResource = async (
  domainName: string,
): Promise<TDomainResource | null> => {
  const { data } = await v2.get(
    `domain/name/${encodeURIComponent(domainName)}`,
    noCacheHeaders,
  );
  return data ?? null;
};

/**
 * Get the scheduled change of registrant tasks of a domain : the FOAs a
 * designated agent may answer are carried by those tasks only
 */
export const getScheduledTradeTasks = async (
  domainName: string,
): Promise<TDomainTaskV2[]> => {
  const { data } = await v2.get(
    `${getTaskPath(domainName)}?type=${
      DomainOperationsEnum.DomainTrade
    }&status=${foaScheduledTaskStatus}`,
    noCacheHeaders,
  );
  // the v2 client hands back an untyped payload : normalise at the boundary
  return Array.isArray(data) ? data : [];
};

/**
 * Get the FOAs of a task : a 404 means the task carries no FOA, an expected
 * case surfaced as an empty list rather than as an error
 */
export const getTaskFoas = async (
  domainName: string,
  taskId: string,
): Promise<TFoa[]> => {
  try {
    const { data } = await v2.get(
      `${getTaskPath(domainName)}/${encodeURIComponent(taskId)}/foa`,
      noCacheHeaders,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if ((error as ApiError)?.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Record the designated agent answer on a single FOA
 */
export const validateFoa = async (
  domainName: string,
  taskId: string,
  foaId: string,
  choice: FoaChoiceEnum,
): Promise<void> => {
  await v2.post(
    `${getTaskPath(domainName)}/${encodeURIComponent(
      taskId,
    )}/foa/${encodeURIComponent(foaId)}/validate`,
    { choice },
  );
};

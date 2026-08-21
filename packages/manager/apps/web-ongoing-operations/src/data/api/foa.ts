import { ApiError, v2 } from '@ovh-ux/manager-core-api';
import { DomainOperationsEnum, foaScheduledTaskStatus } from '@/constants';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { TDomainTaskV2, TFoa } from '@/types';

const getTaskPath = (domainName: string) =>
  `domain/name/${encodeURIComponent(domainName)}/task`;

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
  );
  return data;
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
    );
    return data;
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

import {
  DomainOperationsEnum,
  foaEligibleOperationStatuses,
} from '@/constants';
import { TDomainTaskV2, TFoa, TOngoingOperations } from '@/types';

/**
 * A FOA is still pending while the holder has not answered it, ie while its
 * currentState carries no CHOICE property.
 */
export const isPendingFoa = (foa: TFoa): boolean =>
  !foa.currentState || !('CHOICE' in foa.currentState);

/** Sortable timestamp of an APIv2 task, 0 when the API sends no date. */
const getTaskTimestamp = (task: TDomainTaskV2): number => {
  const date = task.createdAt ?? task.updatedAt;
  const timestamp = date ? new Date(date).getTime() : Number.NaN;
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

/**
 * Most recent task of an APIv2 task list. There should only be one scheduled
 * trade per domain, but the API returns a list. Single pass, so the first task
 * wins when timestamps are equal or missing, without sorting the whole list.
 */
export const getMostRecentTask = (
  tasks: TDomainTaskV2[],
): TDomainTaskV2 | null =>
  tasks.reduce<TDomainTaskV2 | null>(
    (mostRecent, task) =>
      mostRecent && getTaskTimestamp(mostRecent) >= getTaskTimestamp(task)
        ? mostRecent
        : task,
    null,
  );

/**
 * An operation may be validated by a designated agent only while it is a
 * change of registrant still running. The APIv6 status of the operation is
 * the authority here : a done, cancelled — or otherwise finished — trade can
 * no longer be answered, whatever the APIv2 task list carries for the domain.
 */
export const isFoaEligibleOperation = (
  operation?: Pick<TOngoingOperations, 'function' | 'status'> | null,
): boolean =>
  operation?.function === DomainOperationsEnum.DomainTrade &&
  foaEligibleOperationStatuses.includes(operation.status);

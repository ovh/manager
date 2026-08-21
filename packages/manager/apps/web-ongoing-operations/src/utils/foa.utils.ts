import { TDomainTaskV2, TFoa } from '@/types';

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
 * trade per domain, but the API returns a list.
 */
export const getMostRecentTask = (
  tasks: TDomainTaskV2[],
): TDomainTaskV2 | null =>
  [...(tasks ?? [])].sort(
    (a, b) => getTaskTimestamp(b) - getTaskTimestamp(a),
  )[0] ?? null;

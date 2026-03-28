import isEqual from 'lodash/isEqual';
import { UPDATING_STATUSES } from './updatedOperationStatus.types';
import { BaseResource } from '@ovh-ux/manager-module-vcd-api';

export const isResourceUpdating = <
  T extends BaseResource<Record<string, unknown>>
>(
  item: T | undefined,
): boolean => {
  if (!item) return false;
  return UPDATING_STATUSES.includes(
    item.resourceStatus as typeof UPDATING_STATUSES[number],
  );
};

export const getChangedFields = (
  currentState: Record<string, unknown> | undefined,
  targetSpec: Record<string, unknown> | undefined,
  ignoreFields: string[] = [],
): string[] => {
  if (!currentState || !targetSpec) return [];

  const allKeys = new Set([
    ...Object.keys(currentState),
    ...Object.keys(targetSpec),
  ]);

  const changedFields: string[] = [];
  allKeys.forEach((key) => {
    if (
      !ignoreFields.includes(key) &&
      !isEqual(currentState[key], targetSpec[key])
    ) {
      changedFields.push(key);
    }
  });

  return changedFields;
};

export const findUpdatingItems = <
  T extends BaseResource<Record<string, unknown>>
>(
  items: T[] | undefined,
): T[] => {
  if (!items) return [];
  return items.filter((item) => isResourceUpdating(item));
};

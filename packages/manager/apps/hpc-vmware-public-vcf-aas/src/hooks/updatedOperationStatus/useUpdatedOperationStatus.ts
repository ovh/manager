import { useMemo, useRef, useEffect } from 'react';
import {
  UpdatingInfo,
  OperationsStatusResult,
  UPDATING_STATUSES,
} from './updatedOperationStatus.types';
import { BaseResource } from '@ovh-ux/manager-module-vcd-api';
import {
  isResourceUpdating,
  getChangedFields,
} from './updatedOperationStatus.utils';

type UpdateStatusOptions = {
  ignoreFields?: string[];
};

type PrevStatusInfo = {
  status: string;
  changedFields: string[];
};

export const useUpdatedOperationStatus = <
  T extends BaseResource<Record<string, unknown>>
>(
  item: T | undefined,
  options: UpdateStatusOptions = {},
): UpdatingInfo | null => {
  const { ignoreFields = [] } = options;

  return useMemo(() => {
    if (!isResourceUpdating(item)) return null;

    const changedFields = getChangedFields(
      item.currentState as Record<string, unknown>,
      item.targetSpec as Record<string, unknown>,
      ignoreFields,
    );

    return {
      id: item.id,
      changedFields,
    };
  }, [item, ignoreFields]);
};

export const useListUpdatedOperationsStatus = <
  T extends BaseResource<Record<string, unknown>>
>(
  items: T[] | undefined,
  options: UpdateStatusOptions = {},
): OperationsStatusResult => {
  const { ignoreFields = [] } = options;

  // Track previous statuses for transition detection
  const prevStatusMapRef = useRef<Map<string, PrevStatusInfo>>(new Map());

  const result = useMemo(() => {
    const updatingResources: UpdatingInfo[] = [];
    const completedResources: UpdatingInfo[] = [];
    const erroredResources: UpdatingInfo[] = [];

    if (!items) {
      return { updatingResources, completedResources, erroredResources };
    }

    items.forEach((item) => {
      const prev = prevStatusMapRef.current.get(item.id);
      const currentStatus = item.resourceStatus;
      const changedFields = getChangedFields(
        item.currentState as Record<string, unknown>,
        item.targetSpec as Record<string, unknown>,
        ignoreFields,
      );

      // Currently updating
      if (
        UPDATING_STATUSES.includes(
          currentStatus as typeof UPDATING_STATUSES[number],
        )
      ) {
        updatingResources.push({ id: item.id, changedFields });
      }

      // Transitioned: UPDATING => READY
      if (
        prev &&
        UPDATING_STATUSES.includes(
          prev.status as typeof UPDATING_STATUSES[number],
        ) &&
        currentStatus === 'READY'
      ) {
        completedResources.push({
          id: item.id,
          changedFields: prev.changedFields,
        });
      }

      // Transitioned: UPDATING => ERROR
      if (
        prev &&
        UPDATING_STATUSES.includes(
          prev.status as typeof UPDATING_STATUSES[number],
        ) &&
        currentStatus === 'ERROR'
      ) {
        erroredResources.push({
          id: item.id,
          changedFields: prev.changedFields,
        });
      }
    });

    return { updatingResources, completedResources, erroredResources };
  }, [items, ignoreFields]);

  useEffect(() => {
    if (!items) return;
    const newMap = new Map<string, PrevStatusInfo>();
    items.forEach((item) => {
      const changedFields = getChangedFields(
        item.currentState as Record<string, unknown>,
        item.targetSpec as Record<string, unknown>,
        ignoreFields,
      );
      newMap.set(item.id, { status: item.resourceStatus, changedFields });
    });
    prevStatusMapRef.current = newMap;
  }, [items, ignoreFields]);

  return result;
};

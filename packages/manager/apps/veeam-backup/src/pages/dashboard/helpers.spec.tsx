import { describe, it, expect } from 'vitest';
import { TServiceConsumption } from '@/type/service-consumption.type';

import { filterConsumedVms, getConsumption } from './helpers';
import {
  VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
  VEEAM_BACKUP_CONSUMPTION_PLAN_CODE,
} from '@/pages/dashboard/Dashboard.constants';

describe('filterConsumedVms', () => {
  it('returns only VMs with the correct planCode', () => {
    const consumptions: TServiceConsumption[] = [
      { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
      { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
        uniqueId: 'id3',
        quantity: 0,
      },
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
        uniqueId: 'id4',
        quantity: 0,
      },
    ];

    const result = filterConsumedVms(consumptions);
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
        uniqueId: 'id3',
        quantity: 0,
      },
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE,
        uniqueId: 'id4',
        quantity: 0,
      },
    ]);
  });

  it('returns an empty array when no VMs match the planCode', () => {
    const consumptions: TServiceConsumption[] = [
      { planCode: 'randomCode1', uniqueId: 'id1', quantity: 0 },
      { planCode: 'randomCode2', uniqueId: 'id2', quantity: 0 },
    ];

    const result = filterConsumedVms(consumptions);
    expect(result).toHaveLength(0);
  });

  it('returns an empty array when input is empty', () => {
    const consumptions: TServiceConsumption[] = [];
    const result = filterConsumedVms(consumptions);
    expect(result).toHaveLength(0);
  });
});

describe('getConsumption', () => {
  const offerName = 'BRONZE';

  it('updates usedSpaceInGB correctly when consumption is found', () => {
    const consumptions: TServiceConsumption[] = [
      { planCode: 'randomCode', uniqueId: 'id1', quantity: 100 },
      {
        planCode: VEEAM_BACKUP_CONSUMPTION_PLAN_CODE.BRONZE,
        uniqueId: 'id2',
        quantity: 500,
      },
    ];

    const result = getConsumption(offerName, consumptions);
    expect(result).toBe(500);
  });

  it('sets usedSpaceInGB to 0 when no matching consumption found', () => {
    const consumptions: TServiceConsumption[] = [
      { planCode: 'randomCode', uniqueId: 'id1', quantity: 100 },
    ];

    const result = getConsumption(offerName, consumptions);
    expect(result).toBe(0);
  });

  it('handles empty consumption array', () => {
    const result = getConsumption(offerName, []);
    expect(result).toBe(0);
  });

  it('handles undefined consumptions', () => {
    const result = getConsumption(offerName, []);
    expect(result).toBe(0);
  });
});

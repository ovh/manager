import { describe, it, expect } from 'vitest';
import { filterConsumedVms } from './helpers';
import { VEEAM_BACKUP_CONSUMPTION_VCD_VM_CODE } from '@/pages/dashboard/Dashboard.constants';
import { TServiceConsumption } from '@/type/service-consumption.type';

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

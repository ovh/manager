import { describe, it, expect } from 'vitest';
import {
  getMostRecentTask,
  isFoaEligibleOperation,
  isPendingFoa,
} from '@/utils/foa.utils';
import { StatusEnum } from '@/enum/status.enum';
import { TDomainTaskV2 } from '@/types';

const taskId = 'f0a1c2d3-0000-4a1b-9b7e-000000000001';

const scheduledTasks: TDomainTaskV2[] = [
  {
    id: 'f0a1c2d3-0000-4a1b-9b7e-000000000000',
    type: 'DomainTrade',
    status: 'SCHEDULED',
    createdAt: '2026-08-01T09:12:00+02:00',
  },
  {
    id: taskId,
    type: 'DomainTrade',
    status: 'SCHEDULED',
    createdAt: '2026-08-10T09:12:00+02:00',
  },
];

describe('isPendingFoa', () => {
  it('is pending while the currentState carries no CHOICE', () => {
    expect(isPendingFoa({ id: 'foa-1' })).toBe(true);
    expect(isPendingFoa({ id: 'foa-2', currentState: {} })).toBe(true);
    expect(
      isPendingFoa({ id: 'foa-3', currentState: { STATUS: 'WAITING' } }),
    ).toBe(true);
  });

  it('is not pending anymore once a CHOICE is recorded', () => {
    expect(
      isPendingFoa({ id: 'foa-1', currentState: { CHOICE: 'ACCEPT' } }),
    ).toBe(false);
    expect(
      isPendingFoa({ id: 'foa-2', currentState: { CHOICE: 'REJECT' } }),
    ).toBe(false);
  });
});

describe('getMostRecentTask', () => {
  it('returns the most recent task of the list', () => {
    expect(getMostRecentTask(scheduledTasks)?.id).toBe(taskId);
  });

  it('returns null when the domain has no task', () => {
    expect(getMostRecentTask([])).toBeNull();
  });

  it('does not reorder tasks sent without any date', () => {
    const tasks = [
      { id: 'first', type: 'DomainTrade', status: 'SCHEDULED' },
      { id: 'second', type: 'DomainTrade', status: 'SCHEDULED' },
    ];
    expect(getMostRecentTask(tasks)?.id).toBe('first');
  });
});

describe('isFoaEligibleOperation', () => {
  const operation = { function: 'DomainTrade', status: StatusEnum.TODO };

  it('is eligible while the trade is still running', () => {
    [
      StatusEnum.TODO,
      StatusEnum.DOING,
      StatusEnum.ERROR,
      StatusEnum.PROBLEM,
    ].forEach((status) => {
      expect(isFoaEligibleOperation({ ...operation, status })).toBe(true);
    });
  });

  it('is not eligible anymore on a finished trade', () => {
    expect(
      isFoaEligibleOperation({ ...operation, status: StatusEnum.DONE }),
    ).toBe(false);
    expect(
      isFoaEligibleOperation({ ...operation, status: StatusEnum.CANCELLED }),
    ).toBe(false);
  });

  it('is not eligible on another operation, nor on a missing one', () => {
    expect(
      isFoaEligibleOperation({ ...operation, function: 'DomainDnsUpdate' }),
    ).toBe(false);
    expect(isFoaEligibleOperation(undefined)).toBe(false);
    expect(isFoaEligibleOperation(null)).toBe(false);
  });
});

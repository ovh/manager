import '@/setupTests';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { v2 } from '@ovh-ux/manager-core-api';
import {
  getScheduledTradeTasks,
  getTaskFoas,
  validateFoa,
} from '@/data/api/foa';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { TDomainTaskV2, TFoa } from '@/types';

const domainName = 'change-of-registrant.ovh';
const taskId = 'f0a1c2d3-0000-4a1b-9b7e-000000000001';

const scheduledTasks: TDomainTaskV2[] = [
  {
    id: taskId,
    type: 'DomainTrade',
    status: 'SCHEDULED',
    createdAt: '2026-08-10T09:12:00+02:00',
  },
];

const foas: TFoa[] = [
  { id: 'foa-current-holder', currentState: { STATUS: 'WAITING' } },
  {
    id: 'foa-new-holder',
    currentState: { STATUS: 'ANSWERED', CHOICE: 'ACCEPT' },
  },
];

describe('foa api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters the task listing on the scheduled trades', async () => {
    (v2.get as Mock).mockResolvedValue({ data: scheduledTasks });

    await expect(getScheduledTradeTasks(domainName)).resolves.toEqual(
      scheduledTasks,
    );
    expect(v2.get).toHaveBeenCalledWith(
      `domain/name/${domainName}/task?type=DomainTrade&status=SCHEDULED`,
    );
  });

  it('returns the foa list of a task', async () => {
    (v2.get as Mock).mockResolvedValue({ data: foas });

    await expect(getTaskFoas(domainName, taskId)).resolves.toEqual(
      foas,
    );
    expect(v2.get).toHaveBeenCalledWith(
      `domain/name/${domainName}/task/${taskId}/foa`,
    );
  });

  it('maps a 404 on the foa listing to an empty list', async () => {
    (v2.get as Mock).mockRejectedValue({ response: { status: 404 } });

    await expect(getTaskFoas(domainName, taskId)).resolves.toEqual([]);
  });

  it('rethrows any other error of the foa listing', async () => {
    (v2.get as Mock).mockRejectedValue({ response: { status: 500 } });

    await expect(getTaskFoas(domainName, taskId)).rejects.toMatchObject({
      response: { status: 500 },
    });
  });

  it('posts the choice on the validate call', async () => {
    (v2.post as Mock).mockResolvedValue({ data: undefined });

    await validateFoa(
      domainName,
      taskId,
      'foa-current-holder',
      FoaChoiceEnum.Reject,
    );
    expect(v2.post).toHaveBeenCalledWith(
      `domain/name/${domainName}/task/${taskId}/foa/foa-current-holder/validate`,
      { choice: FoaChoiceEnum.Reject },
    );
  });
});

import '@/setupTests';
import { Mock, describe, it, expect, vi, beforeEach } from 'vitest';
import { v2 } from '@ovh-ux/manager-core-api';
import {
  getDomainResource,
  getScheduledTradeTasks,
  getTaskFoas,
  validateFoa,
} from '@/data/api/foa';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { TDomainTaskV2, TFoa } from '@/types';

const domainName = 'change-of-registrant.ovh';
/** Every FOA read asks the api for a fresh object, never a cached list. */
const noCache = { headers: { Pragma: 'no-cache' } };
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
  { id: 'foa-current-holder', currentState: {} },
  { id: 'foa-new-holder', currentState: { choice: FoaChoiceEnum.Accept } },
];

describe('foa api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads the domain resource carrying the designated agent verdict', async () => {
    (v2.get as Mock).mockResolvedValue({
      data: { currentState: { designatedAgentAllowed: false } },
    });

    await expect(getDomainResource(domainName)).resolves.toEqual({
      currentState: { designatedAgentAllowed: false },
    });
    expect(v2.get).toHaveBeenCalledWith(
      `domain/name/${domainName}`,
      noCache,
    );
  });

  it('filters the task listing on the scheduled trades', async () => {
    (v2.get as Mock).mockResolvedValue({ data: scheduledTasks });

    await expect(getScheduledTradeTasks(domainName)).resolves.toEqual(
      scheduledTasks,
    );
    expect(v2.get).toHaveBeenCalledWith(
      `domain/name/${domainName}/task?type=DomainTrade&status=SCHEDULED`,
      noCache,
    );
  });

  it('returns the foa list of a task', async () => {
    (v2.get as Mock).mockResolvedValue({ data: foas });

    await expect(getTaskFoas(domainName, taskId)).resolves.toEqual(
      foas,
    );
    expect(v2.get).toHaveBeenCalledWith(
      `domain/name/${domainName}/task/${taskId}/foa`,
      noCache,
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

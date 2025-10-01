import { describe, it, expect } from 'vitest';
import { checkHasActiveTasks, checkResourceStatus } from './NetworkAcl.context';

describe('Network acl context checkHasActiveTasks', () => {
  it('returns true if any task is PENDING or RUNNING', () => {
    const data = [
      { currentTasks: [{ status: 'PENDING' }] },
      { currentTasks: [{ status: 'DONE' }] },
    ] as any;
    expect(checkHasActiveTasks(data)).toBe(true);
  });

  it('returns false if no active tasks', () => {
    const data = [{ currentTasks: [{ status: 'DONE' }] }] as any;
    expect(checkHasActiveTasks(data)).toBe(false);
  });

  it('returns false if data is undefined', () => {
    expect(checkHasActiveTasks(undefined)).toBe(false);
  });
});

describe('Network acl context checkRessourceStatus', () => {
  it('returns true if any resource has running status', () => {
    const data = [
      { resourceStatus: 'CREATING' },
      { resourceStatus: 'READY' },
    ] as any;
    expect(checkResourceStatus(data)).toBe(true);
  });

  it('returns false if all statuses are stable', () => {
    const data = [{ resourceStatus: 'READY' }] as any;
    expect(checkResourceStatus(data)).toBe(false);
  });

  it('returns false if data is undefined', () => {
    expect(checkResourceStatus(undefined)).toBe(false);
  });
});

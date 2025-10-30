import { describe, it, expect } from 'vitest';
import { checkHasActiveTasks, checkResourceStatus } from './NetworkAcl.context';

describe('Network acl context checkHasActiveTasks', () => {
  it.each([
    {
      description: 'returns true if any task is PENDING or RUNNING',
      data: [
        { currentTasks: [{ status: 'PENDING' }] },
        { currentTasks: [{ status: 'DONE' }] },
      ] as any,
      expected: true,
    },
    {
      description: 'returns false if no active tasks',
      data: [{ currentTasks: [{ status: 'DONE' }] }] as any,
      expected: false,
    },
    {
      description: 'returns false if data is undefined',
      data: undefined,
      expected: false,
    },
  ])('$description', ({ data, expected }) => {
    expect(checkHasActiveTasks(data)).toBe(expected);
  });
});
describe('Network acl context checkResourceStatus', () => {
  it.each([
    {
      description: 'returns true if any resource has running status',
      data: [
        { resourceStatus: 'CREATING' },
        { resourceStatus: 'READY' },
      ] as any,
      expected: true,
    },
    {
      description: 'returns false if all statuses are stable',
      data: [{ resourceStatus: 'READY' }] as any,
      expected: false,
    },
    {
      description: 'returns false if data is undefined',
      data: undefined,
      expected: false,
    },
  ])('$description', ({ data, expected }) => {
    expect(checkResourceStatus(data)).toBe(expected);
  });
});

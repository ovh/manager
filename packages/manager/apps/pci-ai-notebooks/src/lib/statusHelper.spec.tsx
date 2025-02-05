import { expect } from 'vitest';
import * as ai from '@/types/cloud/project/ai';
import {
  isDeletingNotebook,
  isRunningNotebook,
  isStoppedNotebook,
} from './statusHelper';

describe('notebookHelper', () => {
  it('isRunningNotebook', () => {
    expect(isRunningNotebook(ai.notebook.NotebookStateEnum.RESTARTING)).toBe(
      true,
    );
    expect(isRunningNotebook(ai.notebook.NotebookStateEnum.DELETING)).toBe(
      false,
    );
    expect(isRunningNotebook(ai.notebook.NotebookStateEnum.STARTING)).toBe(
      true,
    );
    expect(isRunningNotebook(ai.notebook.NotebookStateEnum.RUNNING)).toBe(true);
  });

  it('isStoppedNotebook', () => {
    expect(isStoppedNotebook(ai.notebook.NotebookStateEnum.STOPPED)).toBe(true);
    expect(isRunningNotebook(ai.notebook.NotebookStateEnum.DELETING)).toBe(
      false,
    );
  });

  it('isDeletingNotebook', () => {
    expect(isDeletingNotebook(ai.notebook.NotebookStateEnum.DELETING)).toBe(
      true,
    );
    expect(isDeletingNotebook(ai.notebook.NotebookStateEnum.STARTING)).toBe(
      false,
    );
  });

  it('isDataSync', () => {
    // expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.RUNNING)).toBe(
    //   true,
    // );
    // expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.SYNC_FAILED)).toBe(
    //   true,
    // );
    // expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.DELETING)).toBe(
    //   false,
    // );
  });
});

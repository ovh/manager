import { expect } from 'vitest';
import * as ai from '@/types/cloud/project/ai';
import {
  isDataSyncNotebook,
  isDeletingNotebook,
  isRunningNotebook,
  isStoppedNotebook,
} from './notebookHelper';

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

  it('isDataSyncNotebook', () => {
    expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.RUNNING)).toBe(
      true,
    );
    expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.SYNC_FAILED)).toBe(
      true,
    );
    expect(isDataSyncNotebook(ai.notebook.NotebookStateEnum.DELETING)).toBe(
      false,
    );
  });
});

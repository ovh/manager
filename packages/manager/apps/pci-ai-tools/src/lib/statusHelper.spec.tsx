import { expect } from 'vitest';
import {
  isDataSync,
  isDeletingNotebook,
  isRunningNotebook,
  isStoppedNotebook,
} from './statusHelper';
import ai from '@/types/AI';

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
    expect(isStoppedNotebook(ai.notebook.NotebookStateEnum.FAILED)).toBe(true);
    expect(isStoppedNotebook(ai.notebook.NotebookStateEnum.ERROR)).toBe(true);
    expect(isStoppedNotebook(ai.notebook.NotebookStateEnum.SYNC_FAILED)).toBe(
      true,
    );
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
    expect(isDataSync(ai.notebook.NotebookStateEnum.RUNNING)).toBe(true);
    expect(isDataSync(ai.notebook.NotebookStateEnum.SYNC_FAILED)).toBe(true);
    expect(isDataSync(ai.notebook.NotebookStateEnum.DELETING)).toBe(false);
    expect(isDataSync(ai.job.JobStateEnum.RUNNING)).toBe(true);
    expect(isDataSync(ai.job.JobStateEnum.SYNC_FAILED)).toBe(true);
    expect(isDataSync(ai.app.AppStateEnum.RUNNING)).toBe(true);
  });
});

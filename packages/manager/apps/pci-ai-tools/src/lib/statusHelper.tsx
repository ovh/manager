import ai from '@/types/AI';

export const isRunningNotebook = (
  currentState: ai.notebook.NotebookStateEnum,
) =>
  [
    ai.notebook.NotebookStateEnum.RESTARTING,
    ai.notebook.NotebookStateEnum.RUNNING,
    ai.notebook.NotebookStateEnum.STARTING,
  ].includes(currentState);

export const isStoppedNotebook = (
  currentState: ai.notebook.NotebookStateEnum,
) =>
  [
    ai.notebook.NotebookStateEnum.STOPPED,
    ai.notebook.NotebookStateEnum.ERROR,
    ai.notebook.NotebookStateEnum.FAILED,
    ai.notebook.NotebookStateEnum.SYNC_FAILED,
  ].includes(currentState);

export const isDeletingNotebook = (
  currentState: ai.notebook.NotebookStateEnum,
) => [ai.notebook.NotebookStateEnum.DELETING].includes(currentState);

export function isDataSync(currentState: string) {
  return (
    currentState === ai.job.JobStateEnum.RUNNING ||
    currentState === ai.job.JobStateEnum.SYNC_FAILED ||
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.SYNC_FAILED ||
    currentState === ai.app.AppStateEnum.RUNNING
  );
}

export const isRunningJob = (currentState: ai.job.JobStateEnum) =>
  [
    ai.job.JobStateEnum.RUNNING,
    ai.job.JobStateEnum.RESTARTING,
    ai.job.JobStateEnum.INITIALIZING,
    ai.job.JobStateEnum.PENDING,
    ai.job.JobStateEnum.QUEUED,
    ai.job.JobStateEnum.INTERRUPTING,
  ].includes(currentState);

export const isStoppedJob = (currentState: ai.job.JobStateEnum) =>
  [
    ai.job.JobStateEnum.DONE,
    ai.job.JobStateEnum.ERROR,
    ai.job.JobStateEnum.FAILED,
    ai.job.JobStateEnum.INTERRUPTED,
    ai.job.JobStateEnum.SYNC_FAILED,
    ai.job.JobStateEnum.TIMEOUT,
    ai.job.JobStateEnum.FINALIZING,
    ai.job.JobStateEnum.INTERRUPTING,
  ].includes(currentState);

export function isDeletingApp(currentState: ai.app.AppStateEnum) {
  return currentState === ai.app.AppStateEnum.DELETING;
}

export function isRunningApp(currentState: ai.app.AppStateEnum) {
  return (
    currentState === ai.app.AppStateEnum.RUNNING ||
    currentState === ai.app.AppStateEnum.SCALING ||
    currentState === ai.app.AppStateEnum.INITIALIZING ||
    currentState === ai.app.AppStateEnum.QUEUED
  );
}

export function isStoppedApp(currentState: ai.app.AppStateEnum) {
  return (
    currentState === ai.app.AppStateEnum.ERROR ||
    currentState === ai.app.AppStateEnum.FAILED ||
    currentState === ai.app.AppStateEnum.STOPPED
  );
}

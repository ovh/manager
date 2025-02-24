import * as ai from '@/types/cloud/project/ai';

export function isRunningNotebook(currentState: ai.notebook.NotebookStateEnum) {
  return (
    currentState === ai.notebook.NotebookStateEnum.RESTARTING ||
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.STARTING
  );
}

export function isStoppedNotebook(currentState: ai.notebook.NotebookStateEnum) {
  return (
    currentState === ai.notebook.NotebookStateEnum.STOPPED ||
    currentState === ai.notebook.NotebookStateEnum.ERROR ||
    currentState === ai.notebook.NotebookStateEnum.FAILED ||
    currentState === ai.notebook.NotebookStateEnum.SYNC_FAILED
  );
}

export function isDeletingNotebook(
  currentState: ai.notebook.NotebookStateEnum,
) {
  return currentState === ai.notebook.NotebookStateEnum.DELETING;
}

export function isRunningJob(currentState: ai.job.JobStateEnum) {
  return (
    currentState === ai.job.JobStateEnum.RUNNING ||
    currentState === ai.job.JobStateEnum.RESTARTING ||
    currentState === ai.job.JobStateEnum.INITIALIZING ||
    currentState === ai.job.JobStateEnum.PENDING ||
    currentState === ai.job.JobStateEnum.QUEUED ||
    currentState === ai.job.JobStateEnum.INTERRUPTING
  );
}

export function isStoppedJob(currentState: ai.job.JobStateEnum) {
  return (
    currentState === ai.job.JobStateEnum.DONE ||
    currentState === ai.job.JobStateEnum.ERROR ||
    currentState === ai.job.JobStateEnum.FAILED ||
    currentState === ai.job.JobStateEnum.INTERRUPTED ||
    currentState === ai.job.JobStateEnum.SYNC_FAILED ||
    currentState === ai.job.JobStateEnum.TIMEOUT
  );
}

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

export function isDataSync(currentState: string) {
  return (
    currentState === ai.job.JobStateEnum.RUNNING ||
    currentState === ai.job.JobStateEnum.SYNC_FAILED ||
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.SYNC_FAILED ||
    currentState === ai.app.AppStateEnum.RUNNING
  );
}

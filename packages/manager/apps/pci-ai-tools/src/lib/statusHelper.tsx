import ai from '@/types/AI';

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

export function isDataSync(currentState: string) {
  return (
    currentState === ai.job.JobStateEnum.RUNNING ||
    currentState === ai.job.JobStateEnum.SYNC_FAILED ||
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.SYNC_FAILED ||
    currentState === ai.app.AppStateEnum.RUNNING
  );
}

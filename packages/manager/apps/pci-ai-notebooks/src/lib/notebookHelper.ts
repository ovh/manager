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

export function isDataSyncNotebook(
  currentState: ai.notebook.NotebookStateEnum,
) {
  return (
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.SYNC_FAILED
  );
}

export const OVH_TAGS_CONFIG = {
  id: 'ovh/id',
  type: 'ovh/type',
};

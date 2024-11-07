import * as ai from '@/types/cloud/project/ai';

export function isRunningNotebook(currentState: ai.notebook.NotebookStateEnum) {
  return (
    currentState === ai.notebook.NotebookStateEnum.RESTARTING ||
    currentState === ai.notebook.NotebookStateEnum.RUNNING ||
    currentState === ai.notebook.NotebookStateEnum.STARTING
  );
}

export function isDeletingNotebook(
  currentState: ai.notebook.NotebookStateEnum,
) {
  return currentState === ai.notebook.NotebookStateEnum.DELETING;
}

export const OVH_TAGS_CONFIG = {
  id: 'ovh/id',
  type: 'ovh/type',
};

export function isOvhTags(key: string) {
  return key === OVH_TAGS_CONFIG.id || key === OVH_TAGS_CONFIG.type;
}

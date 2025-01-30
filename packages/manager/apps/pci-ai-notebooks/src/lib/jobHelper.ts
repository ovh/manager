import * as ai from '@/types/cloud/project/ai';

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

export function isDataSyncJob(currentState: ai.job.JobStateEnum) {
  return (
    currentState === ai.job.JobStateEnum.RUNNING ||
    currentState === ai.job.JobStateEnum.SYNC_FAILED
  );
}

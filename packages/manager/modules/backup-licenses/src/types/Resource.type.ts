/** Les 8 membres de `common.ResourceStatusEnum` du contrat v2 `backupServices`. */
export type ResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'OUT_OF_SYNC'
  | 'READY'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'UPDATING';

export type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

/** Opération asynchrone en cours sur une ressource (cf. polling BKP-1220). */
export type CurrentTask = {
  id: string;
  link: string;
  status: TaskStatus | null;
  type: string;
};

/**
 * Enveloppe des ressources de l'API v2.
 * `currentTasks` reste optionnel ici : les ressources qui en dépendent vraiment
 * le resserrent en obligatoire (cf. BackupServerResource).
 */
export type Resource<T> = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: T;
  currentTasks?: CurrentTask[];
  targetSpec?: Partial<T>;
  createdAt?: string;
  updatedAt?: string;
};

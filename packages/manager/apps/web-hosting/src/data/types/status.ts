export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  UPDATING = 'UPDATING',
  SUSPENDED = 'SUSPENDED',
  DONE = 'DONE',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  NONE = 'NONE',
}

export enum GitStatus {
  CREATED = 'CREATED',
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  DEPLOYING = 'DEPLOYING',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
  INITIALERROR = 'INITIAL_ERROR',
}

export enum TaskStatus {
  ERROR = 'ERROR',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
}
export enum DomainStatus {
  cancelled = 'cancelled',
  doing = 'doing',
  done = 'done',
  init = 'init',
  todo = 'todo',
}

export enum DnsStatus {
  CONFIGURED = 'DNS_CONFIGURED',
  EXTERNAL = 'DNS_EXTERNAL',
  NOT_CONFIGURED = 'DNS_NOT_CONFIGURED',
}

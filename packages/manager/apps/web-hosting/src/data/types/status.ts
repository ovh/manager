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
export const GIT_STATUS_WITH_TOOLTIP = {
  [GitStatus.DISABLED]: 'disabled',
  [GitStatus.INITIALERROR]: 'lastdeploy',
  [GitStatus.ERROR]: 'lastdeploy',
  [GitStatus.DELETING]: 'lastdeploy',
  [GitStatus.DEPLOYING]: 'lastdeploy',
};

export enum SeoStatus {
  CREATED = 'created',
  CREATING = 'creating',
  DELETING = 'deleting',
  UPDATING = 'updating',
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

export enum OngoingTaskStatus {
  CANCELLED = 'cancelled',
  DOING = 'doing',
  DONE = 'done',
  INIT = 'init',
  TODO = 'todo',
}

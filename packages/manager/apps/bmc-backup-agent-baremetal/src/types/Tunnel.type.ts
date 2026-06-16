/**
 * Server data captured at the end of Step 1 (checkout success), passed down to Step 2
 * so it can start polling the freshly ordered backup service.
 */
export type Step1CompletedData = {
  serverName: string;
  serverIp: string;
  serverRegion: string;
};

/**
 * Step 2 provisioning state machine. Phases advance forward only; a retry resets to
 * `polling-tenant`, and `ready` / `error-creation` / `timeout` are terminal.
 */
export type TunnelPollingPhase =
  | 'init'
  | 'polling-tenant'
  | 'polling-vspc'
  | 'polling-status'
  | 'ready'
  | 'error-creation'
  | 'error-network'
  | 'timeout';

export type TunnelOs = 'LINUX' | 'WINDOWS';

/** Management-agent download URLs, one per OS (returned by the managementAgent endpoint). */
export type AgentDownloadLinks = {
  linuxUrl: string;
  windowsUrl: string;
};

/** Provisioning lifecycle status returned by the VSPC tenant detail endpoint. */
export type TunnelResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

/** Minimal tenant shape returned by the backupServices/tenant listing. */
export type TunnelTenant = {
  id: string;
};

/** Minimal VSPC shape returned by the tenant/{id}/vspc listing. */
export type TunnelVspc = {
  id: string;
};

/** VSPC detail carrying the provisioning status polled in phase 3. */
export type TunnelVspcDetail = {
  id: string;
  resourceStatus: TunnelResourceStatus;
};

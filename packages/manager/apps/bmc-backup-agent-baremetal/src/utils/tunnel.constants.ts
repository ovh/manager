import { TunnelOs } from '@/types/Tunnel.type';

/** Absolute polling timeout: 30 minutes from the moment Step 2 unlocks. */
export const POLLING_TIMEOUT_MS = 30 * 60 * 1000;

/** Interval between two polling requests (each phase). */
export const POLLING_INTERVAL_MS = 5_000;

/** Management-agent download URLs stay fresh for an hour. */
export const AGENT_STALE_TIME_MS = 60 * 60 * 1000;

/** OS selector options for the agent installation panel. */
export const OS_OPTIONS: { value: TunnelOs; label: string }[] = [
  { value: 'LINUX', label: 'Linux' },
  { value: 'WINDOWS', label: 'Windows' },
];

/** Fallback filename when a Windows download URL has no parseable filename. */
export const WINDOWS_FILENAME_FALLBACK = 'agent.exe';

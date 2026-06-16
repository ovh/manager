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

/** Locale-invariant external links surfaced by the tunnel. */
export const TUNNEL_LINKS = {
  faq: 'https://help.ovhcloud.com/csm/fr-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074396',
  orderBaremetal: 'https://www.ovhcloud.com/fr/bare-metal/',
  support: 'https://www.ovhcloud.com/fr/support-levels/',
  installGuide: 'https://help.ovhcloud.com/csm/fr-backup-agent-first-configuration',
  paymentSettings: 'https://www.ovh.com/manager/#/dedicated/billing/payment/method',
} as const;

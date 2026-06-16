import { v2 } from '@ovh-ux/manager-core-api';

import {
  AgentDownloadLinks,
  TunnelTenant,
  TunnelVspc,
  TunnelVspcDetail,
} from '@/types/Tunnel.type';

const TENANTS_ROUTE = '/backupServices/tenant';
const getVspcListRoute = (tenantId: string) => `${TENANTS_ROUTE}/${tenantId}/vspc`;
const getVspcDetailRoute = (tenantId: string, vspcId: string) =>
  `${getVspcListRoute(tenantId)}/${vspcId}`;
const getManagementAgentRoute = (tenantId: string, vspcId: string) =>
  `${getVspcDetailRoute(tenantId, vspcId)}/managementAgent`;

/** Phase 1 — list the account's backup tenants (the first one is the freshly created service). */
export const getTunnelTenants = async (): Promise<TunnelTenant[]> => {
  const { data } = await v2.get<TunnelTenant[]>(TENANTS_ROUTE);
  return data;
};

/** Phase 2 — list the VSPC(s) attached to a tenant. */
export const getTunnelVspcs = async (tenantId: string): Promise<TunnelVspc[]> => {
  const { data } = await v2.get<TunnelVspc[]>(getVspcListRoute(tenantId));
  return data;
};

/** Phase 3 — read the VSPC provisioning status (CREATING → READY | ERROR). */
export const getTunnelVspcDetail = async (
  tenantId: string,
  vspcId: string,
): Promise<TunnelVspcDetail> => {
  const { data } = await v2.get<TunnelVspcDetail>(getVspcDetailRoute(tenantId, vspcId));
  return data;
};

/** Management-agent download URLs for the agent installation panel. */
export const getTunnelManagementAgent = async (
  tenantId: string,
  vspcId: string,
): Promise<AgentDownloadLinks> => {
  const { data } = await v2.get<AgentDownloadLinks>(getManagementAgentRoute(tenantId, vspcId));
  return data;
};

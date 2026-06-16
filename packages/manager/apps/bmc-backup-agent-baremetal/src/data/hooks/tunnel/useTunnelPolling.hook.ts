import { useQuery } from '@tanstack/react-query';

import {
  getTunnelManagementAgent,
  getTunnelTenants,
  getTunnelVspcDetail,
  getTunnelVspcs,
} from '@/data/api/tunnel/tunnel.api';
import { AGENT_STALE_TIME_MS, POLLING_INTERVAL_MS } from '@/utils/tunnel.constants';

import { tunnelQueryKey } from './tunnelQueryKey';

/** Phase 1 — polls the tenant list every 5s until a tenant appears. */
export const useTunnelTenantPolling = (enabled: boolean) =>
  useQuery({
    queryKey: tunnelQueryKey.tenants(),
    queryFn: getTunnelTenants,
    enabled,
    refetchInterval: enabled ? POLLING_INTERVAL_MS : false,
    gcTime: 0,
  });

/** Phase 2 — polls the VSPC list for a tenant every 5s until a VSPC appears. */
export const useTunnelVspcPolling = (tenantId: string, enabled: boolean) =>
  useQuery({
    queryKey: tunnelQueryKey.vspcs(tenantId),
    queryFn: () => getTunnelVspcs(tenantId),
    enabled: enabled && !!tenantId,
    refetchInterval: enabled ? POLLING_INTERVAL_MS : false,
    gcTime: 0,
  });

/** Phase 3 — polls the VSPC status every 5s until READY or ERROR. */
export const useTunnelVspcStatusPolling = (tenantId: string, vspcId: string, enabled: boolean) =>
  useQuery({
    queryKey: tunnelQueryKey.vspcDetail(tenantId, vspcId),
    queryFn: () => getTunnelVspcDetail(tenantId, vspcId),
    enabled: enabled && !!tenantId && !!vspcId,
    refetchInterval: enabled ? POLLING_INTERVAL_MS : false,
    gcTime: 0,
  });

/**
 * Management-agent download URLs. Enabled as soon as tenantId + vspcId resolve
 * (phase `polling-status`); cached for an hour since the URLs are stable.
 */
export const useManagementAgent = (tenantId: string, vspcId: string, enabled: boolean) =>
  useQuery({
    queryKey: tunnelQueryKey.managementAgent(tenantId, vspcId),
    queryFn: () => getTunnelManagementAgent(tenantId, vspcId),
    enabled: enabled && !!tenantId && !!vspcId,
    staleTime: AGENT_STALE_TIME_MS,
  });

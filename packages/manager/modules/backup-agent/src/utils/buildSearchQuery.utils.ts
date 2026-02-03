import { urlParams, urls } from '@/routes/routes.constants';

export const buildSearchQuery = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString() ? `?${searchParams}` : '';
};

export type TBuildDeleteTenantUrlParams = {
  tenantId: string;
  origin?: 'listing' | 'dashboard';
};

export type TBuildDeleteAgentUrlParams = {
  tenantId: string;
  agentId: string;
  origin?: 'dashboard' | 'configuration';
};

export const buildDeleteTenantUrl = ({
  tenantId,
  origin = 'listing',
}: TBuildDeleteTenantUrlParams) => {
  const url =
    origin === 'dashboard'
      ? { fallback: urls.dashboardTenants, base: urls.dashboardTenantDelete }
      : { fallback: urls.listingTenants, base: urls.listingTenantDelete };

  if (tenantId) {
    return origin === 'dashboard'
      ? url.base.replace(urlParams.tenantId, tenantId)
      : `${url.base}${buildSearchQuery({ tenantId })}`;
  }
  return url.fallback;
};

export const buildDeleteAgentUrl = ({
  tenantId,
  agentId,
  origin = 'dashboard',
}: TBuildDeleteAgentUrlParams) => {
  const url =
    origin === 'dashboard'
      ? { fallback: urls.dashboardTenantAgents, base: urls.dashboardTenantAgentDelete }
      : { fallback: urls.dashboardTenantAgents, base: urls.dashboardTenantAgentDelete };

  return tenantId ? `${url.base}${buildSearchQuery({ tenantId, agentId })}` : url.fallback;
};

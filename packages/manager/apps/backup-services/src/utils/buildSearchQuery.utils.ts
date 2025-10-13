import { urls } from '@/routes/Routes.constants';

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

export const buildDeleteTenantUrl = ({
  tenantId,
  origin = 'listing',
}: TBuildDeleteTenantUrlParams) => {
  const url =
    origin === 'dashboard'
      ? { fallback: urls.dashboard, base: urls.dashboardTenantDelete }
      : { fallback: urls.listing, base: urls.listingTenantDelete };

  return tenantId ? `${url.base}${buildSearchQuery({ tenantId })}` : url.fallback;
};

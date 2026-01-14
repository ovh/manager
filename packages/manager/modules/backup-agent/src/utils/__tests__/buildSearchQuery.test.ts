import { describe, expect, it } from 'vitest';

import { urlParams, urls } from '@/routes/routes.constants';

import {
  TBuildDeleteAgentUrlParams,
  TBuildDeleteTenantUrlParams,
  buildDeleteAgentUrl,
  buildDeleteTenantUrl,
  buildSearchQuery,
} from '../buildSearchQuery.utils';

describe('buildSearchQuery test suite', () => {
  const id = 'testId';
  const taskId = 'testTask';
  const page = 42;
  const debug = false;

  it('returns the search query with params passed', () => {
    expect(buildSearchQuery({ id })).toEqual(`?id=${id}`);
    expect(buildSearchQuery({ id, taskId, page, debug })).toEqual(
      `?id=${id}&taskId=${taskId}&page=${page}&debug=${debug}`,
    );
  });

  it('returns the search query without undefined or empty string params passed', () => {
    expect(
      buildSearchQuery({
        id,
        taskId: '',
        debug: undefined,
      }),
    ).toEqual(`?id=${id}`);
  });

  it('returns an empty string if all params are empty or undefined', () => {
    expect(buildSearchQuery({ id: '', taskId: undefined })).toEqual('');
  });
});

describe('buildDeleteTenantUrl test suite', () => {
  const testCases: Array<
    TBuildDeleteTenantUrlParams & {
      desc: string;
      expectedUrl: string;
    }
  > = [
    {
      desc: 'listingUrl if tenantId is empty & origin=listing',
      tenantId: '',
      origin: 'listing',
      expectedUrl: urls.listingTenants,
    },
    {
      desc: 'dashboardUrl if tenantId is undefined & origin=dashboard',
      tenantId: undefined as unknown as string,
      origin: 'dashboard',
      expectedUrl: urls.dashboardTenants,
    },
    {
      desc: 'listing deleteUrl if tenantId is valid & origin=listing',
      tenantId: '42',
      origin: 'listing',
      expectedUrl: `${urls.listingTenantDelete}?tenantId=42`,
    },
    {
      desc: 'dashboard deleteUrl if tenantId is valid & origin=dashboard',
      tenantId: '42',
      origin: 'dashboard',
      expectedUrl: urls.dashboardTenantDelete.replace(urlParams.tenantId, '42'),
    },
  ];

  it.each(testCases)('returns the $desc', ({ tenantId, origin, expectedUrl }) => {
    expect(buildDeleteTenantUrl({ tenantId, origin })).toEqual(expectedUrl);
  });
});

describe('buildDeleteAgentUrl test suite', () => {
  const testCases: Array<
    TBuildDeleteAgentUrlParams & {
      desc: string;
      expectedUrl: string;
    }
  > = [
    {
      desc: 'fallback url if tenantId is empty',
      tenantId: '',
      agentId: 'A1',
      origin: 'dashboard',
      expectedUrl: urls.dashboardTenantAgents,
    },
    {
      desc: 'fallback url if tenantId is undefined',
      tenantId: undefined as unknown as string,
      agentId: 'A1',
      origin: 'dashboard',
      expectedUrl: urls.dashboardTenantAgents,
    },
    {
      desc: 'dashboard deleteUrl if tenantId & agentId are valid',
      tenantId: '42',
      agentId: '007',
      origin: 'dashboard',
      expectedUrl: `${urls.dashboardTenantAgentDelete}?tenantId=42&agentId=007`,
    },
    {
      desc: 'configuration origin still uses same base and fallback',
      tenantId: '42',
      agentId: 'abc',
      origin: 'configuration',
      expectedUrl: `${urls.dashboardTenantAgentDelete}?tenantId=42&agentId=abc`,
    },
  ];

  it.each(testCases)('returns the $desc', ({ tenantId, agentId, origin, expectedUrl }) => {
    expect(buildDeleteAgentUrl({ tenantId, agentId, origin })).toEqual(expectedUrl);
  });
});

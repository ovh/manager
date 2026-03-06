import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { render } from '@testing-library/react';
import '@/common/setupTests';
import ZonePage from "../zone/Zone.page";
import { wrapper } from '@/common/utils/test.provider';
import { useGetDomainResource, useGetDomainZone } from '@/domain/hooks/data/query';
import { useGetDomainZoneRecords } from '@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { domainZoneMock } from '@/domain/__mocks__/dnsDetails';
import { fieldsTypesMock, paginatedZoneRecordsMock, zoneRecordsMock } from '@/zone/__mocks__/records';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainZone: vi.fn(),
}));

vi.mock('@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords', () => ({
  useGetDomainZoneRecords: vi.fn(),
}));

vi.mock('@/common/hooks/iam/useGetIAMResource', () => ({
  useGetIAMResource: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    useAuthorizationIam: vi.fn(),
  };
});

vi.mock('@/zone/pages/zone/components/ZoneDnsDatagrid', () => ({
  default: () => <div data-testid="zone-dns-datagrid" />,
}));

describe('ZonePage', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    });

    (useGetDomainResource as Mock).mockReturnValue({
      domainResource: serviceInfoDetail,
      isFetchingDomainResource: false,
      domainResourceError: null,
    });

    (useGetDomainZone as Mock).mockReturnValue({
      domainZone: domainZoneMock,
      isFetchingDomainZone: false,
      domainZoneError: null,
    });

    (useGetDomainZoneRecords as Mock).mockReturnValue({
      data: {
        records: zoneRecordsMock,
        fieldsTypes: fieldsTypesMock,
        paginatedZone: paginatedZoneRecordsMock,
      },
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      fetchAllPages: vi.fn(),
    });

    (useGetIAMResource as Mock).mockReturnValue({
      data: [{ urn: 'urn:v1:eu:resource:dnsZone:example.com' }],
    });

    (useAuthorizationIam as Mock).mockReturnValue({
      isPending: false,
      isAuthorized: true,
      isError: false,
      isLoading: false,
      status: 'success',
      data: {
        urn: 'urn:v1:eu:resource:dnsZone:example.com',
        authorizedActions: [
          'dnsZone:apiovh:record/get',
          'dnsZone:apiovh:record/create',
          'dnsZone:apiovh:record/delete',
          'dnsZone:apiovh:record/edit',
          'dnsZone:apiovh:soa/edit',
          'dnsZone:apiovh:reset',
          'dnsZone:apiovh:import',
        ],
        unauthorizedActions: [],
      },
      error: undefined,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
    } as unknown as ReturnType<typeof useAuthorizationIam>);
  });

  it('should render correctly', async () => {
    const { getByTestId } = render(<ZonePage />, { wrapper });

    expect(getByTestId('zone-page-description-1')).toBeInTheDocument();
    expect(getByTestId('zone-page-description-1')).toHaveTextContent('zone_page_description');

  });
});

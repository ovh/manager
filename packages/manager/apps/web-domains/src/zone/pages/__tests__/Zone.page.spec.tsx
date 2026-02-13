import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { render} from '@testing-library/react';
import '@/common/setupTests';
import ZonePage from "../zone/Zone.page";
import { wrapper } from '@/common/utils/test.provider';
import { useGetDomainResource, useGetDomainZone } from '@/domain/hooks/data/query';
import { useGetDomainZoneRecords } from '@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { domainZoneMock } from '@/domain/__mocks__/dnsDetails';
import { fieldsTypesMock, paginatedZoneRecordsMock, zoneRecordsMock } from '@/zone/__mocks__/records';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainZone: vi.fn(),
}));

vi.mock('@/zone/hooks/useGetDomainZoneRecords/useGetDomainZoneRecords', () => ({
  useGetDomainZoneRecords: vi.fn(),
}));

describe('ZonePage', () => {
  beforeEach(() => {
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
  });

  it('should render correctly', async () => {
    const { getByTestId, getByText } = render(<ZonePage />, { wrapper });
   
      expect(
        getByText('zone_page_subdomain'),
      ).toBeInTheDocument();
      expect(
        getByText('zone_page_ttl'),
      ).toBeInTheDocument();
      expect(
        getByText('zone_page_target'),
      ).toBeInTheDocument();
      expect(
        getByText('zone_page_type'),
      ).toBeInTheDocument();
   
      expect(getByTestId('datagrid')).toBeInTheDocument();
      expect(getByTestId('zone-page-description-1')).toHaveTextContent('zone_page_description');
      
  });
});
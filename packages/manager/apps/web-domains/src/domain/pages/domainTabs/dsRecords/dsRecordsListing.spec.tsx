import '@/common/setupTests';
import { vi, describe, it, expect, Mock } from 'vitest';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import DsRecordsListing from '@/domain/pages/domainTabs/dsRecords/dsRecordsListing';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import { domainZoneMock } from '@/domain/__mocks__/dnsDetails';
import {
  ActiveConfigurationTypeEnum,
  DnsConfigurationTypeEnum,
} from '@/domain/enum/dnsConfigurationType.enum';
import * as dataHooks from '@/domain/hooks/data/query';
import { TDomainResource } from '@/domain/types/domainResource';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';

vi.mock('@/domain/hooks/data/query', async () => {
  const actual = await vi.importActual('@/domain/hooks/data/query');

  return {
    ...actual,
    useGetDomainResource: vi.fn(() => ({
      domainResource: serviceInfoDetail,
      isFetchingDomainResource: false,
      domainResourceError: null,
    })),
    useUpdateDomainResource: vi.fn(() => ({
      updateDomain: vi.fn(),
      isUpdateDomainPending: false,
    })),
    useGetDomainZone: vi.fn(() => ({
      domainZone: domainZoneMock,
      isFetchingDomainZone: false,
    })),
    useUpdateDnssecService: vi.fn(() => ({
      updateServiceDnssec: vi.fn(),
      isUpdateIsPending: false,
    })),
    useGetDnssecStatus: vi.fn(() => ({
      dnssecStatus: { status: 'ENABLED' },
      isDnssecStatusLoading: false,
    })),
  };
});

vi.mock('@/common/hooks/iam/useGetIAMResource', () => ({
  useGetIAMResource: vi.fn(),
}));


describe('DS Records Columns', () => {
  const setDrawer = vi.fn();
  const setDsRecordsData = vi.fn();
  const setIsModalOpen = vi.fn();
  const activeConfiguration = ActiveConfigurationTypeEnum.EXTERNAL;

  beforeEach(() => {
    (useGetIAMResource as Mock).mockReturnValue({
      data: [{ urn: 'urn:dnsZone:123' }],
    });
  });

  it('should return the correct number of column', () => {
    const { result } = renderHook(
      () =>
        useDomainDsRecordsDatagridColumns({
          setDrawer,
          setDsRecordsData,
          setIsModalOpen,
          activeConfiguration,
        }),
      { wrapper },
    );

    const columns = result.current;
    expect(columns).toHaveLength(6);
  });

  it('should return the good labels', () => {
    const { result } = renderHook(
      () =>
        useDomainDsRecordsDatagridColumns({
          setDrawer,
          setDsRecordsData,
          setIsModalOpen,
          activeConfiguration,
        }),
      { wrapper },
    );

    const columns = result.current;

    const tests: Record<string, string> = {
      keyTag: 'domain_dsrecords_table_header_keyTag',
      flags: 'domain_dsrecords_table_header_flags',
      algorithm: 'domain_dsrecords_table_header_algo',
      publicKey: 'domain_dsrecords_table_header_publicKey',
    };

    Object.keys(tests).forEach((key) => {
      const dnssecColumns = columns.find((col) => col.id === key);
      expect(dnssecColumns).toBeDefined();
      expect(dnssecColumns?.label).toBe(tests[key]);
    });
  });
});

describe('DS Records Datagrid', () => {
  beforeEach(() => {
    (useGetIAMResource as Mock).mockReturnValue({
      data: [{ urn: 'urn:dnsZone:123' }],
    });
  });

  it('should display the content of host datagrid and an informative message when the config is internal', () => {
    const { getByTestId } = render(<DsRecordsListing />, {
      wrapper,
    });
    expect(getByTestId('datagrid')).toBeInTheDocument();

    const message = getByTestId('internalConfigMessage');
    expect(message).toBeInTheDocument();
  });
  it('should display the content of host datagrid and an allow actions when the config is not internal', () => {
    const domainResourceWWithExternalConfig: TDomainResource = {
      ...serviceInfoDetail,
      currentState: {
        ...serviceInfoDetail.currentState,
        dnsConfiguration: {
          ...serviceInfoDetail.currentState.dnsConfiguration,
          configurationType: DnsConfigurationTypeEnum.EXTERNAL,
        },
      },
    };

    (dataHooks.useGetDomainResource as Mock).mockReturnValue({
      domainResource: domainResourceWWithExternalConfig,
      isFetchingDomainResource: false,
      domainResourceError: null,
    });

    const { getByTestId } = render(<DsRecordsListing />, {
      wrapper,
    });
    expect(getByTestId('datagrid')).toBeInTheDocument();

    const addButton = getByTestId('addButton');
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);

    const drawer = getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
  });
});

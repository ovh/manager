import '@/common/setupTests';
import { vi, describe, it, expect } from 'vitest';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import DsRecordsListing from '@/domain/pages/domainTabs/dsRecords/dsRecordsListing';
import { serviceInfoDetail } from '@/domain/__mocks__/serviceInfoDetail';
import { useDomainDsRecordsDatagridColumns } from '@/domain/hooks/domainTabs/useDomainDsRecordsDatagridColumns';
import { domainZoneMock } from '@/domain/__mocks__/dnsDetails';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(() => ({
    domainResource: serviceInfoDetail,
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
}));

vi.mock('@/domain/utils/utils', async () => {
  const actual = await vi.importActual<typeof import('@/domain/utils/utils')>(
    '@/domain/utils/utils',
  );

  return {
    ...actual,
    isDsRecordActionDisabled: vi.fn(() => false),
  };
});

describe('DS Records Columns', () => {
  const setDrawer = vi.fn();
  const setDsRecordsData = vi.fn();
  const setIsModalOpen = vi.fn();
  const activeConfiguration = ActiveConfigurationTypeEnum.EXTERNAL;

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
  it('should display the content of host datagrid', () => {
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

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
}));

vi.mock(import('@/domain/utils/utils'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isDsRecordActionDisabled: vi.fn(() => false),
  };
});

describe('DS Records Columns', () => {
  const setDrawer = vi.fn();
  const setDsRecordsData = vi.fn();
  const activeConfiguration = ActiveConfigurationTypeEnum.EXTERNAL;
  const { result } = renderHook(() =>
    useDomainDsRecordsDatagridColumns({
      setDrawer,
      setDsRecordsData,
      activeConfiguration,
    }),
  );
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(6);
  });

  it('should return the good labels', () => {
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

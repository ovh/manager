import '@/alldoms/setupTests';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useDomainDatagridColumns } from '@/alldoms/hooks/domainDatagrid/useDomainDatagridColumns';

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof import('react-router-dom') = await importOriginal();
  return {
    ...original,
    useSearchParams: () => [{ get: (str: string) => str }],
    useNavigate: vi.fn(),
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
  };
});

describe('Datagrid columns', () => {
  const { result } = renderHook(() => useDomainDatagridColumns());
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(6);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      domainName: 'allDom_domain_table_header_domain_name',
      status: 'allDom_domain_table_header_status',
      dns_server: 'allDom_domain_table_header_dns_server',
      transfert_protection: 'allDom_domain_table_header_transfert_protection',
      dnssec: 'allDom_domain_table_header_dnssec',
      expiration_date: 'allDom_domain_table_header_expiration_date',
    };

    Object.keys(tests).forEach((key) => {
      const allDomColumns = columns.find((col) => col.id === key);
      expect(allDomColumns).toBeDefined();
      expect(allDomColumns?.label).toBe(tests[key]);
    });
  });
});

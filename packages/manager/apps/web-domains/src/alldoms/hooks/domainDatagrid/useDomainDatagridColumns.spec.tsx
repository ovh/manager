import '@/common/setupTests';
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
    expect(columns).toHaveLength(4);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      domainName: 'allDom_domain_table_header_domain_name',
      status: 'allDom_domain_table_header_status',
      domain_renew_mode: 'allDom_table_header_renewMode',
      expiration_date: 'allDom_domain_table_header_expiration_date',
    };

    Object.keys(tests).forEach((key) => {
      const allDomColumns = columns.find((col) => col.id === key);
      expect(allDomColumns).toBeDefined();
      expect(allDomColumns?.label).toBe(tests[key]);
    });
  });
});

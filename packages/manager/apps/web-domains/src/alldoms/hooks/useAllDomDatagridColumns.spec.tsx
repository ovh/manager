import '@/alldoms/setupTests';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAllDomDatagridColumns } from './useAllDomDatagridColumns';

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
  const { result } = renderHook(() => useAllDomDatagridColumns(null));
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(10);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      serviceName: 'allDom_table_header_serviceName',
      renewMode: 'allDom_table_header_renewMode',
      type: 'allDom_table_header_type',
      register_domain: 'allDom_table_header_register_domain',
      authorized_domain: 'allDom_table_header_authorized_domain',
      expiration_date: 'allDom_table_header_expirationDate',
      nicAdmin: 'allDom_table_header_nicAdmin',
      nicTech: 'allDom_table_header_nicTech',
      nicBilling: 'allDom_table_header_nicBilling',
    };

    Object.keys(tests).forEach((key) => {
      const allDomColumns = columns.find((col) => col.id === key);
      expect(allDomColumns).toBeDefined();
      expect(allDomColumns?.label).toBe(tests[key]);
    });
  });
});

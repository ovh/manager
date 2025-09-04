import '@/common/setupTests';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useAllDomDatagridColumns } from '@/alldoms/hooks/allDomDatagrid/useAllDomDatagridColumns';

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
  const { result } = renderHook(() => useAllDomDatagridColumns());
  const columns = result.current;
  it('should return the correct number of column', () => {
    expect(columns).toHaveLength(9);
  });

  it('should return the good labels', () => {
    const tests: Record<string, string> = {
      id: 'allDom_table_header_id',
      renewMode: 'allDom_table_header_renewMode',
      type: 'allDom_table_header_type',
      authorized_domain: 'allDom_table_header_registered_authorized_domain',
      expiration_date: 'allDom_domain_table_header_expiration_date',
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

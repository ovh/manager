import '@/setupTests';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { domain } from '@/__mocks__/domain';
import { ParentEnum } from '@/enum/parent.enum';

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

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() =>
      useOngoingOperationDatagridColumns(ParentEnum.DOMAIN, domain),
    );
    const columns = result.current;

    expect(columns).toHaveLength(7);

    const tests: Record<string, string> = {
      domain: 'domain_operations_table_header_domain',
      function: 'domain_operations',
      comment: 'domain_operations_table_header_comment',
      created_on: 'domain_operations_table_header_creationDate',
      last_updated: 'domain_operations_table_header_lastUpdate',
      status: 'domain_operations_table_header_status',
    };

    Object.keys(tests).forEach((key) => {
      const domainColumn = columns.find((col) => col.id === key);
      expect(domainColumn).toBeDefined();
      expect(domainColumn?.label).toBe(tests[key]);
    });
  });
});

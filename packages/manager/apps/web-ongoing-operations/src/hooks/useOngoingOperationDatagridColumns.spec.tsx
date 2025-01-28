import '@/setupTests';
import React from 'react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { NavLinkProps } from 'react-router-dom';
import { vi } from 'vitest';
import { useOngoingOperationDatagridColumns } from '@/hooks/useOngoingOperationDatagridColumns';
import { domain } from '@/__mocks__/domain';

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof import('react-router-dom') = await importOriginal();
  return {
    ...original,
    useSearchParams: () => [{ get: (str: string) => str }],
    useNavigate: vi.fn(),
    useLocation: vi.fn().mockReturnValue({
      pathname: 'pathname',
    }),
    NavLink: ({ ...params }: NavLinkProps) => <>{params.children}</>,
  };
});

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const { result } = renderHook(() =>
      useOngoingOperationDatagridColumns(true, domain),
    );
    const columns = result.current;

    expect(columns).toHaveLength(7);

    const domainColumn = columns.find((col) => col.id === 'domain');
    expect(domainColumn).toBeDefined();
    expect(domainColumn?.label).toBe('domain_operations_table_header_domain');

    const operationColumn = columns.find((col) => col.id === 'operation');
    expect(operationColumn).toBeDefined();
    expect(operationColumn?.label).toBe('domain_operations');

    const commentColumn = columns.find((col) => col.id === 'comment');
    expect(commentColumn).toBeDefined();
    expect(commentColumn?.label).toBe('domain_operations_table_header_comment');

    const createColumn = columns.find((col) => col.id === 'created_on');
    expect(createColumn).toBeDefined();
    expect(createColumn?.label).toBe(
      'domain_operations_table_header_creationDate',
    );

    const lastUpdatedColumn = columns.find((col) => col.id === 'last_updated');
    expect(lastUpdatedColumn).toBeDefined();
    expect(lastUpdatedColumn?.label).toBe(
      'domain_operations_table_header_lastUpdate',
    );

    const statusColumn = columns.find((col) => col.id === 'status');
    expect(statusColumn).toBeDefined();
    expect(statusColumn?.label).toBe('domain_operations_table_header_status');
  });
});

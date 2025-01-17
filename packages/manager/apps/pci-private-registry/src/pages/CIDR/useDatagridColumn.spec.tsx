import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { UseSuspenseQueryResult } from '@tanstack/react-query';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useIpRestrictionsWithFilter } from '@/api/hooks/useIpRestrictions';
import { useDatagridColumn } from './useDatagridColumn';
import { DatagridProvider } from './DatagridContext.provider';
import { wrapper as Wrap } from '@/wrapperRenders';

import { TIPRestrictionsData } from '@/types';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}));

vi.mock('@/api/hooks/useIpRestrictions', () => ({
  useIpRestrictions: vi.fn(),
  useIpRestrictionsWithFilter: vi.fn(),
}));

describe('useDatagridColumn', () => {
  it('should return the correct columns', () => {
    const mockData = {
      rows: [
        {
          ipBlock: '192.168.0.1',
          checked: true,
          draft: false,
          authorization: ['management'],
          description: 'CIDR 1',
        },
        {
          ipBlock: '192.168.0.2',
          checked: false,
          draft: true,
          authorization: ['registry'],
          description: 'CIDR 2',
        },
      ],
    };

    vi.mocked(useIpRestrictionsWithFilter).mockReturnValue(({
      data: mockData,
    } as unknown) as UseSuspenseQueryResult<{ rows: TIPRestrictionsData[]; pageCount: number; totalRows: number }, Error>);
    vi.mocked(useParams).mockReturnValue({
      projectId: 'project123',
      registryId: 'registry456',
    });
    vi.mocked(useFormContext).mockReturnValue(({
      control: {},
      handleSubmit: vi.fn(),
      formState: {},
    } as unknown) as UseFormReturn<FieldValues, unknown, FieldValues>);

    const { result } = renderHook(() => useDatagridColumn(), {
      wrapper: ({ children }) => (
        <DatagridProvider data={mockData.rows} totalRows={mockData.rows.length}>
          <Wrap>{children}</Wrap>
        </DatagridProvider>
      ),
    });
    const columns = result.current;

    expect(columns).toHaveLength(5);

    const checkColumn = columns.find((col) => col.id === 'check');
    expect(checkColumn).toBeDefined();
    expect(checkColumn?.label).toBe('');
    const cidrColumn = columns.find((col) => col.id === 'cidr');
    expect(cidrColumn).toBeDefined();
    expect(cidrColumn?.label).toBe('private_registry_bloc_cidr');

    const descriptionColumn = columns.find((col) => col.id === 'description');
    expect(descriptionColumn).toBeDefined();
    expect(descriptionColumn?.label).toBe('private_registry_cidr_description');

    const authorizedColumn = columns.find((col) => col.id === 'authorized');
    expect(authorizedColumn).toBeDefined();

    const addColumn = columns.find((col) => col.id === 'add');
    expect(addColumn).toBeDefined();
    expect(addColumn?.label).toBe('');
  });
});

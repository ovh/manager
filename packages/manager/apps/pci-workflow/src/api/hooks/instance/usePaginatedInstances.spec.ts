import { renderHook, waitFor } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { ColumnSort } from '@ovh-ux/manager-react-components';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useAllInstances } from '@/api/hooks/instance/useAllInstances';
import { usePaginatedInstances } from '@/api/hooks/instance/usePaginatedInstances';

vi.mock('@/api/hooks/instance/useAllInstances');

const makeInstance = ({
  id,
  name,
  statusGroup,
  regionLabel,
}: {
  id: string;
  name: string;
  statusGroup?: string;
  regionLabel?: string;
}) =>
  ({
    id: { id, region: 'region' },
    name,
    status: { group: statusGroup },
    region: { label: regionLabel },
  }) as TInstance;

describe('useInstances', () => {
  describe('usePaginatedInstances', () => {
    const instanceToto = makeInstance({ id: '1', name: 'toto' });
    const instanceTatot = makeInstance({ id: '2', name: 'tatot' });
    const instanceToti = makeInstance({ id: '3', name: 'toti' });

    describe('filtering', () => {
      it.each`
        instances                                      | filters                                                                                                                                                           | expectedResult
        ${[instanceToto, instanceTatot, instanceToti]} | ${[]}                                                                                                                                                             | ${[instanceToto, instanceTatot, instanceToti]}
        ${[instanceToto, instanceTatot, instanceToti]} | ${[{ key: 'name', value: 'tot', comparator: FilterComparator.StartsWith } as Filter]}                                                                             | ${[instanceToto, instanceToti]}
        ${[instanceToto, instanceTatot, instanceToti]} | ${[{ key: 'name', value: 'tot', comparator: FilterComparator.Includes } as Filter, { key: 'name', value: 'i', comparator: FilterComparator.EndsWith } as Filter]} | ${[instanceToti]}
        ${[instanceToto, instanceTatot, instanceToti]} | ${[{ key: 'name', value: 'sdfgsdfg', comparator: FilterComparator.Includes } as Filter]}                                                                          | ${[]}
      `(
        'should filter data when filter is $filters',
        async ({
          instances,
          filters,
          expectedResult,
        }: {
          instances: TInstance[];
          filters: Filter[];
          expectedResult: TInstance[];
        }) => {
          vi.mocked(useAllInstances).mockReturnValue({
            instances,
            isPending: false,
          } as ReturnType<typeof useAllInstances>);

          const { result } = renderHook(() =>
            usePaginatedInstances('123', { pagination: { pageSize: 10, pageIndex: 0 } }, filters),
          );

          await waitFor(() => expect(result.current.data.rows).toEqual(expectedResult));
        },
      );
    });

    describe('sorting', () => {
      const instanceActive1 = makeInstance({
        id: '1',
        name: 'aaa',
        statusGroup: 'ACTIVE',
        regionLabel: 'aa',
      });
      const instanceActive2 = makeInstance({
        id: '2',
        name: 'zzz',
        statusGroup: 'ACTIVE',
        regionLabel: 'zz',
      });
      const instancePending = makeInstance({
        id: '3',
        name: 'fff',
        statusGroup: 'PENDING',
        regionLabel: 'ff',
      });

      it.each`
        instances                                              | sorting                                        | expectedResult
        ${[instanceToto, instanceTatot, instanceToti]}         | ${{ id: 'name', desc: false } as ColumnSort}   | ${[instanceTatot, instanceToti, instanceToto]}
        ${[instanceToto, instanceTatot, instanceToti]}         | ${{ id: 'name', desc: true } as ColumnSort}    | ${[instanceToto, instanceToti, instanceTatot]}
        ${[instanceActive1, instancePending, instanceActive2]} | ${{ id: 'status', desc: false } as ColumnSort} | ${[instanceActive1, instanceActive2, instancePending]}
        ${[instanceActive1, instancePending, instanceActive2]} | ${{ id: 'status', desc: true } as ColumnSort}  | ${[instancePending, instanceActive2, instanceActive1]}
        ${[instanceActive1, instancePending, instanceActive2]} | ${{ id: 'region', desc: false } as ColumnSort} | ${[instanceActive1, instancePending, instanceActive2]}
        ${[instanceActive1, instancePending, instanceActive2]} | ${{ id: 'region', desc: true } as ColumnSort}  | ${[instanceActive2, instancePending, instanceActive1]}
      `(
        'should sort data when sort is $sorting',
        async ({
          instances,
          sorting,
          expectedResult,
        }: {
          instances: TInstance[];
          sorting: ColumnSort;
          expectedResult: TInstance[];
        }) => {
          vi.mocked(useAllInstances).mockReturnValue({
            instances,
            isPending: false,
          } as ReturnType<typeof useAllInstances>);

          const { result } = renderHook(() =>
            usePaginatedInstances('123', { pagination: { pageSize: 10, pageIndex: 0 }, sorting }),
          );

          await waitFor(() => expect(result.current.data.rows).toEqual(expectedResult));
        },
      );
    });
  });
});

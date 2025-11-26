import { renderHook, waitFor } from '@testing-library/react';
import { describe, vi } from 'vitest';

import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useAllInstances } from '@/api/hooks/instance/useAllInstances';
import { usePaginatedInstances } from '@/api/hooks/instance/usePaginatedInstances';

vi.mock('@/api/hooks/instance/useAllInstances');

const makeInstance = (id: string, name?: string) =>
  ({
    id: { id, region: 'region' },
    name,
  }) as TInstance;

describe('useInstances', () => {
  describe('usePaginatedInstances', () => {
    const instanceToto = makeInstance('1', 'toto');
    const instanceTatot = makeInstance('2', 'tatot');
    const instanceToti = makeInstance('3', 'toti');

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
  });
});

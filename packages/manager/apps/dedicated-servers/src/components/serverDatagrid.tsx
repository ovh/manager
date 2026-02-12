import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Datagrid, useDataApi, RedirectionGuard } from '@ovh-ux/muk';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ExpandedState, SortingState } from '@tanstack/react-table';

import OrderMenu from '@/components/orderMenu';
import { useColumns } from '@/components/dataGridColumns';
import { useDedicatedServer } from '@/hooks/useDedicatedServer';
import { urls } from '@/routes/routes.constant';
import { ErrorComponent } from '@/components/errorComponent';
import { DedicatedServer } from '@/data/types/server.type';
import {
  ColumnsConfig,
  ViewContext,
} from '@/components/manageView/viewContext';
import { Categories } from './manageView/types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface GroupRow {
  id: string;
  displayName: string;
  subRows: DedicatedServer[];
  [key: string]: any;
}

/**
 * Utility to extract a group key based on a category property.
 */
const getCategoryGroupKey = (
  server: DedicatedServer,
  category: keyof DedicatedServer,
  t: TFunction<'manage-view', undefined>,
): string => {
  return String(server[category] ?? t('server_category_other'));
};

/**
 * Utility to extract the sorting state based on the current grouping strategy.
 */
const getGroupingSorting = (groupBy: Categories): SortingState => {
  if (groupBy) {
    return [{ id: groupBy, desc: false }];
  }

  return [];
};

export default function ServerDatagrid() {
  const { t } = useTranslation('manage-view');
  const columns = useColumns();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const {
    columnVisibility,
    setColumnVisibility,
    columnsConfig,
    groupBy,
  } = useContext(ViewContext);

  const {
    flattenData,
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    filters,
  } = useDataApi<DedicatedServer>({
    version: 'v6',
    iceberg: true,
    enabled: true,
    route: `/dedicated/server`,
    cacheKey: ['dedicated-servers', `/dedicated/server`],
  });

  const { error: errorListing, data: dedicatedServers } = useDedicatedServer();

  // 1. Trigger API Call on GroupBy Change
  useEffect(() => {
    if (!sorting?.setSorting) {
      return;
    }

    const groupSortParams = getGroupingSorting(groupBy);

    if (groupSortParams.length > 0) {
      const primaryGroupSort = groupSortParams[0];

      // We pass a callback to setSorting to access the previous state safely.
      // This removes the need to depend on sorting.sorting in the dependency array.
      sorting.setSorting((prevSorting: SortingState) => {
        const currentPrimarySort = prevSorting[0];

        const needsSortingUpdate =
          !currentPrimarySort ||
          currentPrimarySort.id !== primaryGroupSort.id ||
          currentPrimarySort.desc !== primaryGroupSort.desc;

        // If no update is needed, return the exact same array reference
        // to bail out of the React render cycle.
        if (!needsSortingUpdate) {
          return prevSorting;
        }

        // We keep the previous sorting as secondary sorts.
        const filteredPrevSorting = prevSorting.filter(
          (s) => s.id !== primaryGroupSort.id,
        );

        return [primaryGroupSort, ...filteredPrevSorting];
      });
    }
  }, [groupBy, sorting?.setSorting]);

  // 2. Data Grouping Logic
  // optimized with useMemo to prevent recalculation on every render
  const { isGroupingActive, gridData } = useMemo(() => {
    // If NO grouping is selected or NO data is available: return standard flat list
    if (!flattenData || groupBy === undefined) {
      return {
        isGroupingActive: false,
        gridData: flattenData,
      };
    }

    // Use a Map to strictly preserve insertion order regardless of key type
    const groupsMap = new Map<string, DedicatedServer[]>();

    flattenData.forEach((server) => {
      let groupKey: string;

      if (groupBy) {
        groupKey = getCategoryGroupKey(server, groupBy, t);
      } else {
        return;
      }

      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }

      // We can safely use non-null assertion here because we just set it if it was missing
      groupsMap.get(groupKey)!.push(server);
    });

    // Construct the GroupRow objects expected by TanStack Table
    // Array.from on a Map respects the strict insertion order
    const groupRows: GroupRow[] = Array.from(groupsMap.entries()).map(
      ([key, children]) => ({
        id: `group-${key}`,
        displayName: key,
        subRows: children,
      }),
    );

    return {
      isGroupingActive: true,
      gridData: groupRows,
    };
  }, [groupBy, flattenData]);

  // 2. Column Configuration Logic
  // Adjust column rendering based on whether we are looking at a Group Header or a Data Row
  const effectiveColumns = useMemo(() => {
    // If grouping is NOT active, return standard config
    if (!isGroupingActive) {
      return columnsConfig;
    }

    return columnsConfig.map((config) => {
      // Case A: The Main Column (Server Name)
      // We hijack this column to display the Group Title when looking at a header row
      if (config.id === 'iam.displayName') {
        return {
          ...config,
          isSearchable: false, // Disable search on group headers
          cell: (props: any) => {
            const rowOriginal = props.row.original;

            if (props.row.depth === 0) {
              return (
                <span className="font-bold text-body">
                  {rowOriginal.displayName}
                </span>
              );
            }

            if (config.cell && typeof config.cell === 'function') {
              return config.cell(props);
            }
            return rowOriginal.displayName;
          },
        };
      }

      // Case B: All Other Columns
      // We want them to be empty on the Group Header row to avoid visual clutter or errors
      return {
        ...config,
        isSearchable: false,
        cell: (props: any) => {
          // If it is a group header, render nothing in this column
          if (props.row.depth === 0) {
            return null;
          }

          // Otherwise, render the standard cell content
          if (config.cell && typeof config.cell === 'function') {
            return config.cell(props);
          }
          return null;
        },
      };
    });
  }, [columnsConfig, isGroupingActive]);

  return (
    <>
      {(isError || errorListing) && (
        <ErrorComponent error={isError ? (error as ApiError) : errorListing} />
      )}
      {!isError && !errorListing && (
        <RedirectionGuard
          isLoading={isLoading || !dedicatedServers}
          condition={dedicatedServers && dedicatedServers?.length === 0}
          route={urls.onboarding}
        >
          {flattenData && (
            <div>
              <Datagrid
                columns={
                  effectiveColumns as ColumnsConfig<
                    DedicatedServer | GroupRow
                  >[]
                }
                data={gridData}
                totalCount={totalCount || 0}
                hasNextPage={hasNextPage && !isLoading}
                onFetchNextPage={fetchNextPage}
                sorting={sorting}
                isLoading={isLoading}
                filters={filters}
                columnVisibility={{ columnVisibility, setColumnVisibility }}
                search={search}
                topbar={<OrderMenu exportCsvData={{ columns, totalCount }} />}
                resourceType="dedicatedServer"
                // Expansion configuration for Grouping
                expandable={{
                  expanded,
                  setExpanded,
                  // Only allow expansion if grouping is active and it's a top-level row (depth 0)
                  getRowCanExpand: (row) => isGroupingActive && row.depth === 0,
                }}
              />
            </div>
          )}
        </RedirectionGuard>
      )}
    </>
  );
}

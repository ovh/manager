import React, { useContext, useMemo, useState } from 'react';
import { Datagrid, useDataApi, RedirectionGuard } from '@ovh-ux/muk';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ExpandedState } from '@tanstack/react-table';

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

interface GroupRow {
  id: string;
  displayName: string;
  subRows: DedicatedServer[];
  [key: string]: any;
}

export default function ServerDatagrid() {
  const columns = useColumns();
  // State to manage the expanded/collapsed state of groups
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

  const { error: errorListing, data: dedicatedServer } = useDedicatedServer();

  // 1. Data Grouping Logic
  // optimized with useMemo to prevent recalculation on every render
  const { isGroupingActive, gridData } = useMemo(() => {
    // If NO grouping is selected or NO data is available: return standard flat list
    if (!groupBy || !flattenData) {
      return {
        isGroupingActive: false,
        gridData: flattenData,
      };
    }

    // Performance optimization: Use a single pass loop (forEach) instead of reduce + map
    const groups: Record<string, DedicatedServer[]> = {};

    flattenData.forEach((server) => {
      // Safe access to the grouping property
      const rawVal = String(server[groupBy] || 'Other');

      if (!groups[rawVal]) {
        groups[rawVal] = [];
      }
      groups[rawVal].push(server);
    });

    // Construct the GroupRow objects expected by TanStack Table
    const groupRows: GroupRow[] = Object.entries(groups).map(
      ([key, children]) => ({
        id: `group-${key}`, // Ensure a unique ID for the group row
        displayName: key, // Store the group title directly at the root
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

            // ------------------------------------------------
            // RENDER: GROUP HEADER (depth === 0)
            // ------------------------------------------------
            if (props.row.depth === 0) {
              return (
                <span className="font-bold text-body">
                  {rowOriginal.displayName}
                </span>
              );
            }

            // ------------------------------------------------
            // RENDER: STANDARD ROW
            // ------------------------------------------------
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
          isLoading={isLoading || !dedicatedServer}
          condition={dedicatedServer && dedicatedServer?.length === 0}
          route={urls.onboarding}
        >
          {flattenData && (
            <div>
              <Datagrid
                // Cast to handle the union type of DedicatedServer | GroupRow
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

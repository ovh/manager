import React, { useContext, useMemo, useState } from 'react';
import { Datagrid, RedirectionGuard } from '@ovh-ux/muk';
import { ApiError, FilterComparator } from '@ovh-ux/manager-core-api';
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
import { useGetTemplateInfos } from '@/hooks/useGetTemplateInfo';
import { GroupRow } from './manageView/types';
import { useTranslation } from 'react-i18next';

export default function ServerDatagrid() {
  const { templateList } = useGetTemplateInfos();
  const { t } = useTranslation('manage-view');
  const initialColumns = useColumns();
  const columns = useMemo(() => initialColumns, []);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const {
    columnVisibility,
    setColumnVisibility,
    columnsConfig,
    groupBy,
    gridData,
    isGroupingActive,
    dataApi,
  } = useContext(ViewContext);

  const {
    isError,
    error,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    filters,
  } = dataApi;

  const { error: errorListing, data: dedicatedServers } = useDedicatedServer();

  const [prevGroupBy, setPrevGroupBy] = useState(groupBy);
  if (groupBy !== prevGroupBy) {
    setPrevGroupBy(groupBy);
    setExpanded({});
  }

  const effectiveExpanded: ExpandedState = isGroupingActive
    ? Object.fromEntries(
        gridData
          .filter((r) => 'subRows' in r)
          .map((r) => [
            r.id,
            typeof expanded === 'object'
              ? expanded[r.id as string] ?? true
              : true,
          ]),
      )
    : expanded;

  const handleSetExpanded: typeof setExpanded = (updater) => {
    const newValue =
      typeof updater === 'function' ? updater(effectiveExpanded) : updater;
    // react-table removes keys to collapse rows. We need to explicitly set
    // them to false so that ?? true doesn't re-open them on next render.
    if (typeof newValue === 'object' && typeof effectiveExpanded === 'object') {
      Object.keys(effectiveExpanded).forEach((key) => {
        if (!(key in newValue)) {
          (newValue as Record<string, boolean>)[key] = false;
        }
      });
    }
    setExpanded(newValue);
  };

  // Column Configuration Logic
  // Adjust column rendering based on whether we are looking at a Group Header or a Data Row
  const effectiveColumns = useMemo(() => {
    // If grouping is NOT active, return standard config from context
    if (!isGroupingActive) {
      return columnsConfig;
    }

    const visibleColumns = columnsConfig.filter((config) => config.visible);
    const firstVisibleColumnId = visibleColumns[0]?.id;
    const penultimateVisibleColumnId =
      visibleColumns[visibleColumns.length - 2]?.id;

    return columnsConfig.map((config) => {
      const isGrouped = config.id === groupBy;

      // Case A: The First Visible Column
      // We hijack this column to display the Group Title when looking at a header row
      if (config.id === firstVisibleColumnId) {
        return {
          ...config,
          isSearchable: false, // Disable search on group headers
          cell: (props: any) => {
            const rowOriginal = props.row.original;

            if (props.row.depth === 0) {
              return (
                <div className="datagrid-group-header h-full w-full flex items-center">
                  <span className="font-bold text-[16px] text-[#00185E]">
                    {rowOriginal.displayName}
                  </span>
                </div>
              );
            }

            if (config.cell && typeof config.cell === 'function') {
              return (
                <div
                  className={
                    isGrouped
                      ? 'datagrid-column-grouped h-full w-full flex items-center'
                      : ''
                  }
                >
                  {config.cell(props)}
                </div>
              );
            }
            return null;
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
            if (config.id === penultimateVisibleColumnId) {
              const rowOriginal = props.row.original;
              const count = rowOriginal.subRows.length;

              return (
                <div className="datagrid-group-header h-full w-full flex items-center">
                  <span className="text-body">
                    {t('server_count_items')}{' '}
                    <span className="font-bold">{count}</span>
                  </span>
                </div>
              );
            }
            return (
              <div className="datagrid-group-header h-full w-full flex items-center" />
            );
          }

          // Otherwise, render the standard cell content
          if (config.cell && typeof config.cell === 'function') {
            return (
              <div
                className={
                  isGrouped
                    ? 'datagrid-column-grouped h-full w-full flex items-center'
                    : ''
                }
              >
                {config.cell(props)}
              </div>
            );
          }
          return null;
        },
      };
    });
  }, [columnsConfig, isGroupingActive, groupBy, t]);

  const fnFilter = { ...filters };
  fnFilter.add = (value) => {
    const curentFilter = { ...value };
    if (curentFilter.key === 'os') {
      const tps = templateList.filter((template) =>
        template.description
          .toLowerCase()
          .includes((curentFilter.value as string).toLowerCase()),
      );
      if (!tps.length) return;
      curentFilter.displayValue = curentFilter.value as string;
      if (curentFilter.comparator === FilterComparator.Includes) {
        if (tps.length === 1) {
          curentFilter.value = tps[0]?.templateName;
        } else {
          curentFilter.comparator = FilterComparator.IsIn;
          curentFilter.value = tps.map((os) => os.templateName);
        }
      } else {
        curentFilter.value = tps[0]?.templateName;
      }
    }
    filters.add(curentFilter);
  };

  const topbar = useMemo(
    () => (
      <OrderMenu exportCsvData={{ columns, totalCount: totalCount || 0 }} />
    ),
    [columns, totalCount],
  );

  return (
    <>
      <style>
        {`
          .dedicated-server-datagrid tr:has(.datagrid-group-header) td {
            background-color: #e6e6e6 !important;
            border-color: #e6e6e6 !important;
          }
          .dedicated-server-datagrid tr:has(.datagrid-group-header) td:first-child > div {
            overflow: visible !important;
          }
          .dedicated-server-datagrid [class*="chevron-right"] {
            transform: rotate(90deg);
          }
          .dedicated-server-datagrid [class*="chevron-down"] {
            transform: rotate(180deg);
          }
        `}
      </style>
      <div className="dedicated-server-datagrid">
        {(isError || errorListing) && (
          <ErrorComponent
            error={isError ? (error as ApiError) : errorListing}
          />
        )}
        {!isError && !errorListing && (
          <RedirectionGuard
            isLoading={!dedicatedServers}
            condition={dedicatedServers && dedicatedServers?.length === 0}
            route={urls.onboarding}
          >
            <Datagrid
              columns={
                effectiveColumns as ColumnsConfig<DedicatedServer | GroupRow>[]
              }
              autoScroll={false}
              data={gridData}
              totalCount={isGroupingActive ? undefined : totalCount || 0}
              hasNextPage={hasNextPage && !isLoading}
              onFetchNextPage={fetchNextPage}
              sorting={
                !isGroupingActive
                  ? sorting
                  : {
                      ...sorting,
                      manualSorting: false,
                      sorting: [],
                      setSorting: undefined,
                    }
              }
              isLoading={isLoading}
              filters={fnFilter}
              columnVisibility={{
                columnVisibility,
                setColumnVisibility,
              }}
              search={search}
              topbar={topbar}
              resourceType="dedicatedServer"
              // Expansion configuration for Grouping
              expandable={{
                expanded: effectiveExpanded,
                setExpanded: handleSetExpanded,
                // Only allow expansion if grouping is active and it's a top-level row (depth 0)
                getRowCanExpand: (row) => isGroupingActive && row.depth === 0,
              }}
            />
          </RedirectionGuard>
        )}
      </div>
    </>
  );
}

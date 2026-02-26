import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DatagridColumn, useDataApi, UseDataApiResult } from '@ovh-ux/muk';
import { VisibilityState, SortingState } from '@tanstack/react-table';
import { useColumns } from '../dataGridColumns';
import { DedicatedServer } from '@/data/types/server.type';
import { Categories, GroupRow, ViewType } from './types';
import { useGetViewsPreferences } from '@/hooks/manage-views/useGetViewPreferences';
import {
  DEFAULT_COLUMN_VISIBILITY,
  PREFERENCES_KEY,
  STANDARD_VIEW_ID,
} from './manageView.constants';

export type ColumnsConfig<T> = DatagridColumn<T> & {
  visible?: boolean;
  order?: number;
};

export type ViewContextType<T> = {
  views: ViewType[];
  currentView?: ViewType;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
  columnsConfig: ColumnsConfig<T>[];
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  setOrderedColumns: React.Dispatch<
    React.SetStateAction<DatagridColumn<DedicatedServer>[]>
  >;
  setColumnsOrder: (order?: string[]) => void;
  setViews: React.Dispatch<React.SetStateAction<ViewType[]>>;
  groupBy: Categories;
  setGroupBy: (category: Categories) => void;
  gridData: (DedicatedServer | GroupRow)[];
  isGroupingActive: boolean;
  dataApi: UseDataApiResult<T>;
};

export const ViewContext = createContext<ViewContextType<DedicatedServer>>({
  views: [],
  currentView: null,
  setCurrentView: () => {},
  columnsConfig: [],
  columnVisibility: {},
  setViews: () => {},
  setOrderedColumns: () => {},
  setColumnsOrder: () => {},
  setColumnVisibility: () => {},
  groupBy: undefined,
  setGroupBy: () => {},
  gridData: [],
  isGroupingActive: false,
  dataApi: {} as UseDataApiResult<DedicatedServer>,
});

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

export const ViewContextProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('manage-view');
  const [views, setViews] = useState<ViewType[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(null);
  const [groupBy, setGroupBy] = useState<Categories>(undefined);

  const [userColumnVisibility, setUserColumnVisibility] = useState<
    VisibilityState
  >(DEFAULT_COLUMN_VISIBILITY);
  const initialColumns = useColumns();
  const memoizedInitialColumns = useMemo(() => initialColumns, []);
  const [orderedColumns, setOrderedColumns] = useState(memoizedInitialColumns);

  // Fetch saved views preferences
  const { preferences, error, isLoading } = useGetViewsPreferences({
    key: PREFERENCES_KEY,
    enabled: true,
  });

  const dataApi = useDataApi<DedicatedServer>({
    version: 'v6',
    iceberg: true,
    enabled: true,
    route: `/dedicated/server`,
    cacheKey: ['dedicated-servers', `/dedicated/server`],
  });

  const { flattenData, sorting } = dataApi;

  const groupingSorting = useMemo(() => getGroupingSorting(groupBy), [groupBy]);

  const setSortingRef = useRef(sorting?.setSorting);
  useEffect(() => {
    setSortingRef.current = sorting?.setSorting;
  }, [sorting?.setSorting]);

  // 1. Trigger API Call on GroupBy Change
  useEffect(() => {
    setSortingRef.current?.(groupingSorting);
  }, [groupingSorting]);

  // 2. Data Grouping Logic
  const gridDataInfo = useMemo(() => {
    if (!flattenData || groupBy === undefined) {
      return {
        isGroupingActive: false,
        gridData: flattenData || [],
      };
    }

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

      groupsMap.get(groupKey)!.push(server);
    });

    const groupRows: GroupRow[] = Array.from(groupsMap.entries()).map(
      ([key, child]) => ({
        id: `group-${key}`,
        displayName: key,
        subRows: child.map((server) => ({ ...server, id: server.name })),
      }),
    );

    return {
      isGroupingActive: true,
      gridData: groupRows,
    };
  }, [groupBy, flattenData, t]);

  const { isGroupingActive, gridData } = gridDataInfo;

  const setColumnsOrder = useCallback(
    (order?: string[]) => {
      if (order) {
        const currentOrderedColumns = memoizedInitialColumns
          .map((column) => {
            let columnOrderIndex = order.findIndex((id) => id === column.id);
            if (columnOrderIndex === -1) {
              columnOrderIndex = memoizedInitialColumns.findIndex(
                (c) => c.id === column.id,
              );
            }
            return {
              ...column,
              order: columnOrderIndex,
            };
          })
          .sort((a, b) => a.order - b.order);

        setOrderedColumns(currentOrderedColumns);
      } else {
        setOrderedColumns(memoizedInitialColumns);
      }
    },
    [memoizedInitialColumns],
  );

  // When preferences are loaded, set views and current view
  useEffect(() => {
    const viewList: ViewType[] =
      preferences && !error && !isLoading ? [...preferences] : [];

    const foundDefaultView = viewList.find((view) => view.default);

    viewList.unshift({
      name: t('standard_view'),
      id: STANDARD_VIEW_ID,
      default: !foundDefaultView,
    });

    setViews(viewList);
    if (!isLoading && !currentView) {
      setCurrentView(foundDefaultView || viewList[0]);

      if (foundDefaultView?.columnOrder) {
        setColumnsOrder(foundDefaultView?.columnOrder);
      }

      if (foundDefaultView?.columnVisibility) {
        setUserColumnVisibility(foundDefaultView.columnVisibility);
      }

      setGroupBy(foundDefaultView?.groupBy);
    }
  }, [preferences, isLoading, error]);

  // When current view changes, update column visibility, order state and group by state
  useEffect(() => {
    setUserColumnVisibility({
      ...DEFAULT_COLUMN_VISIBILITY,
      ...currentView?.columnVisibility,
    });
    setColumnsOrder(currentView?.columnOrder);

    setGroupBy(currentView?.groupBy);
  }, [currentView]);

  const columnVisibility = useMemo(() => {
    if (!groupBy) return userColumnVisibility;
    return {
      ...userColumnVisibility,
      [groupBy]: true,
    };
  }, [userColumnVisibility, groupBy]);

  const viewContext = useMemo(() => {
    let columns = orderedColumns.map((column) => {
      const isGrouped = column.id === groupBy;
      return {
        ...column,
        visible: !!columnVisibility[column.id],
        enableHiding: isGrouped ? false : column.enableHiding,
      };
    });

    if (groupBy) {
      columns = [...columns].sort((a, b) => {
        if (a.id === groupBy) return -1;
        if (b.id === groupBy) return 1;
        return 0;
      });
    }

    return {
      views,
      currentView,
      setCurrentView,
      columnsConfig: columns,
      columnVisibility,
      setColumnVisibility: setUserColumnVisibility,
      setOrderedColumns,
      setColumnsOrder,
      setViews,
      groupBy,
      setGroupBy,
      gridData,
      isGroupingActive,
      dataApi,
    };
  }, [
    views,
    currentView,
    columnVisibility,
    orderedColumns,
    groupBy,
    gridData,
    isGroupingActive,
    dataApi,
  ]);

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};

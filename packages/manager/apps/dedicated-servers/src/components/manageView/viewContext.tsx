import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn, useGetResourceTags } from '@ovh-ux/muk';
import { VisibilityState } from '@tanstack/react-table';
import { useColumns } from '../dataGridColumns';
import { DedicatedServer } from '@/data/types/server.type';
import { Categories, ViewType } from './types';
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
});

export const ViewContextProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('manage-view');
  const [views, setViews] = useState<ViewType[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(null);
  const [groupBy, setGroupBy] = useState<Categories>(undefined);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY,
  );
  const initialColumns = useColumns();
  const [orderedColumns, setOrderedColumns] = useState(initialColumns);

  // Fetch saved views preferences
  const { preferences, error, isLoading } = useGetViewsPreferences({
    key: PREFERENCES_KEY,
    enabled: true,
  });

  const setColumnsOrder = (order?: string[]) => {
    if (order) {
      const currentOrderedColumns = initialColumns
        .map((column) => {
          let columnOrderIndex = order.findIndex((id) => id === column.id);
          if (columnOrderIndex === -1) {
            columnOrderIndex = initialColumns.findIndex(
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
      setOrderedColumns(initialColumns);
    }
  };

  // When preferences are loaded, set views and current view
  useEffect(() => {
    const viewList: ViewType[] =
      preferences && !error && !isLoading ? preferences : [];

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

      // Make datagrid reflect current view column visibility
      if (foundDefaultView?.columnVisibility) {
        setColumnVisibility(foundDefaultView.columnVisibility);
      }

      setGroupBy(foundDefaultView?.groupBy);
    }
  }, [preferences, isLoading, error]);

  // When current view changes, update column visibility, order state and group by state
  useEffect(() => {
    setColumnVisibility({
      ...DEFAULT_COLUMN_VISIBILITY,
      ...currentView?.columnVisibility,
    });
    setColumnsOrder(currentView?.columnOrder);

    setGroupBy(currentView?.groupBy);
  }, [currentView]);
  const viewContext = useMemo(() => {
    const columnsConfig = orderedColumns
      .filter((element) => element !== null && element !== undefined)
      .map((column) => {
        return {
          ...column,
          visible: columnVisibility[column.id],
        };
      });

    return {
      views,
      currentView,
      setCurrentView,
      columnsConfig,
      columnVisibility,
      setColumnVisibility,
      setOrderedColumns,
      setColumnsOrder,
      setViews,
      groupBy,
      setGroupBy,
    };
  }, [views, currentView, columnVisibility, orderedColumns, groupBy]);

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};

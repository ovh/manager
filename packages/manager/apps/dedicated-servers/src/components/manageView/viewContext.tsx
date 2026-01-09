import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/muk';
import { VisibilityState } from '@tanstack/react-table';
import { useColumns } from '../dataGridColumns';
import { DedicatedServer } from '@/data/types/server.type';
import { ViewType } from './types';
import { useGetViewsPreferences } from '@/hooks/manage-views/useGetViewPreferences';
import {
  DEFAULT_COLUMN_VISIBILITY,
  PREFERENCES_KEY,
  STANDARD_VIEW_ID,
} from './manageView.constants';

export type ColumnsConfig<T> = DatagridColumn<T> & {
  visible?: boolean;
};

export type ViewContextType<T> = {
  views: ViewType[];
  currentView?: ViewType;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
  columnsConfig: ColumnsConfig<T>[];
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export const ViewContext = createContext<ViewContextType<DedicatedServer>>({
  views: [],
  currentView: null,
  setCurrentView: () => {},
  columnsConfig: [],
  columnVisibility: {},
  setColumnVisibility: () => {},
});

export const ViewContextProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation('manage-view');
  const [views, setViews] = useState<ViewType[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    DEFAULT_COLUMN_VISIBILITY,
  );

  // Fetch saved views preferences
  const { preferences, error, isLoading } = useGetViewsPreferences({
    key: PREFERENCES_KEY,
    enabled: true,
  });

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
    setCurrentView(foundDefaultView || viewList[0]);

    // Make datagrid reflect current view column visibility
    if (foundDefaultView?.columnVisibility) {
      setColumnVisibility(foundDefaultView.columnVisibility);
    }
  }, [preferences, isLoading, error]);

  // When current view changes, update column visibility state
  useEffect(() => {
    setColumnVisibility(
      currentView?.columnVisibility || DEFAULT_COLUMN_VISIBILITY,
    );
  }, [currentView]);

  const columns = useColumns();

  const viewContext = useMemo(() => {
    const columnsConfig = columns.map((column) => {
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
    };
  }, [views, currentView, columnVisibility]);

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};

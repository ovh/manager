import {
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { useFormContext } from 'react-hook-form';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ContextDatagridType<
  T extends DatagridAction[] = DatagridAction[]
> = {
  isDraft: boolean;
  isAllDataSelected: boolean;
  rows: T;
  totalRows: number;
  initialData: { current: T };
  updateCheckedStateRow: (ipBlock: string, allIsSelected: boolean) => void;
  removeDraftRow: () => void;
  resetRows: () => void;
  addNewRow: (column?: Record<string, unknown>) => void;
  editActualRow: (ipBlock: string) => unknown;
  draftedData: DatagridAction[];
  isUpdating: boolean;
} & ReturnType<typeof useDataGrid> &
  ReturnType<typeof useColumnFilters>;

const Context = createContext<ContextDatagridType | null>(null);

const createNewRow = <TData extends DatagridAction[]>(
  oldData: TData,
  column?: Record<string, unknown>,
) => [
  {
    draft: true,
    checked: null,
    ...column,
  },
  ...(oldData ?? []),
];

const editRow = <TData extends DatagridAction[]>(
  rows: TData,
  target: string,
) => {
  let editedRow = null;
  const updatedRows = rows.map((item) => {
    if (item.draft) {
      // reset all draft
      return { ...item, draft: false };
    }
    if (item.ipBlock === target) {
      editedRow = {
        ...item,
      };
      return { ...item, checked: null, draft: true };
    }
    return item;
  });
  return { updatedRows, editedRow };
};

const updateCheckedState = <TData extends DatagridAction[]>(
  data: TData,
  isAllDataSelected: boolean,
  ipBlock: string | null,
  allIsSelected?: boolean,
) =>
  data?.map((item) => {
    if (item.checked !== null) {
      if (allIsSelected) {
        return { ...item, checked: !isAllDataSelected };
      }
      if (item.ipBlock === ipBlock) {
        return { ...item, checked: !item.checked };
      }
    }
    return item;
  });

type DatagridAction = {
  ipBlock: string;
  checked?: boolean | null;
  draft: boolean;
};

type DatagridProviderProps<TData extends DatagridAction[]> = {
  dataGrid?: ReturnType<typeof useDataGrid>;
  columnFilters?: ReturnType<typeof useColumnFilters>;
  children: JSX.Element;
  data: TData;
  totalRows: number;
};

const DatagridProvider = <TData extends DatagridAction[]>({
  children,
  data,
  dataGrid,
  columnFilters,
  totalRows,
}: DatagridProviderProps<TData>) => {
  const [draftedData, setDraftedData] = useState(data);
  const [isUpdating, setIsUpdating] = useState(false);

  const initialData = useRef(data);

  useEffect(() => {
    setDraftedData(data);
  }, [data]);

  const isAllDataSelected = useMemo(
    () =>
      draftedData
        .filter((item) => item.checked !== null)
        .every((item) => item.checked),
    [draftedData],
  );

  const updateCheckedStateRow = useCallback(
    (ipBlock: string, allIsSelected: boolean) =>
      setDraftedData(
        updateCheckedState(
          draftedData,
          isAllDataSelected,
          ipBlock,
          allIsSelected,
        ) as TData,
      ),
    [isAllDataSelected, draftedData],
  );

  const removeDraftRow = () => {
    setDraftedData(data);
    setIsUpdating(false);
  };

  const addNewRow = (column: Record<string, unknown>) =>
    setDraftedData(createNewRow(draftedData, column) as TData);

  const editActualRow = (ipBlock: string) => {
    setIsUpdating(true);
    const { editedRow, updatedRows } = editRow(draftedData, ipBlock);
    setDraftedData(updatedRows as TData);
    return editedRow;
  };

  const resetRows = () => {
    setIsUpdating(false);
    setDraftedData(
      draftedData.map((row) => ({
        ...row,
        draft: false,
        checked: false,
      })) as TData,
    );
  };

  const isDraft = useMemo(
    () => draftedData.some((restriction) => restriction.draft),
    [draftedData],
  );

  return (
    <Context.Provider
      value={{
        ...dataGrid,
        ...columnFilters,
        rows: draftedData,
        initialData,
        totalRows,
        draftedData,
        addNewRow,
        editActualRow,
        isAllDataSelected,
        isDraft,
        updateCheckedStateRow,
        removeDraftRow,
        resetRows,
        isUpdating,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, DatagridProvider };

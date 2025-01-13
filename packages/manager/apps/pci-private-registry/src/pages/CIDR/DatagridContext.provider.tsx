import {
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { useFormContext } from 'react-hook-form';
import { createContext, useCallback, useMemo, useRef, useState } from 'react';

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
  addNewRow: (column?: Record<string, unknown>) => void;

  draftedData: DatagridAction[];
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
};

const DatagridProvider = <TData extends DatagridAction[]>({
  children,
  data,
  dataGrid,
  columnFilters,
}: DatagridProviderProps<TData>) => {
  const [draftedData, setDraftedData] = useState(data);
  const initialData = useRef(data);
  const totalRows = data.length + draftedData.length;
  const { reset } = useFormContext();
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
    reset();
  };

  const addNewRow = (column: Record<string, unknown>) =>
    setDraftedData(createNewRow(draftedData, column) as TData);

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
        isAllDataSelected,
        isDraft,
        updateCheckedStateRow,
        removeDraftRow,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, DatagridProvider };

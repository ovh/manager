import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

export interface SelectedObject {
  key: string;
  versionId?: string | null;
}

interface SetSelectionParams extends SelectedObject {
  checked: boolean;
}

interface ObjectSelectionContextValue {
  selectedObjects: Map<string, SelectedObject>;
  isSelected: (key: string, versionId?: string | null) => boolean;
  setSelection: (params: SetSelectionParams) => void;
  selectAll: (objects: SelectedObject[]) => void;
  clearSelection: () => void;
  selectedCount: number;
  getSelectedObjects: () => SelectedObject[];
}

const ObjectSelectionContext = createContext<ObjectSelectionContextValue | null>(
  null,
);

const getSelectionKey = (key: string, versionId?: string | null) =>
  `${key}-${versionId}`;

export function useObjectSelection() {
  const ctx = useContext(ObjectSelectionContext);
  if (!ctx)
    throw new Error(
      'useObjectSelection must be used within ObjectSelectionProvider',
    );
  return ctx;
}

interface ObjectSelectionProviderProps {
  children: React.ReactNode;
}

export function ObjectSelectionProvider({
  children,
}: ObjectSelectionProviderProps) {
  const [selectedObjects, setSelectedObjects] = useState<
    Map<string, SelectedObject>
  >(new Map());

  const isSelected = useCallback(
    (key: string, versionId?: string | null) => {
      return selectedObjects.has(getSelectionKey(key, versionId));
    },
    [selectedObjects],
  );

  const setSelection = useCallback((params: SetSelectionParams) => {
    const { key, versionId, checked } = params;
    setSelectedObjects((prev) => {
      const newMap = new Map(prev);
      const mapKey = getSelectionKey(key, versionId);
      if (checked) {
        newMap.set(mapKey, { key, versionId });
      } else {
        newMap.delete(mapKey);
      }
      return newMap;
    });
  }, []);

  const selectAll = useCallback((objects: SelectedObject[]) => {
    setSelectedObjects(
      new Map(
        objects.map((obj) => [getSelectionKey(obj.key, obj.versionId), obj]),
      ),
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedObjects(new Map());
  }, []);

  const getSelectedObjects = useCallback(() => {
    return Array.from(selectedObjects.values());
  }, [selectedObjects]);

  const value = useMemo(
    () => ({
      selectedObjects,
      isSelected,
      setSelection,
      selectAll,
      clearSelection,
      selectedCount: selectedObjects.size,
      getSelectedObjects,
    }),
    [
      selectedObjects,
      isSelected,
      setSelection,
      selectAll,
      clearSelection,
      getSelectedObjects,
    ],
  );

  return (
    <ObjectSelectionContext.Provider value={value}>
      {children}
    </ObjectSelectionContext.Provider>
  );
}

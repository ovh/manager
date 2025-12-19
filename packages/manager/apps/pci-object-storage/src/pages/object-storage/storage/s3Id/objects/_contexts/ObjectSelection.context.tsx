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

interface ObjectSelectionContextValue {
  selectedObjects: Map<string, SelectedObject>;
  isSelected: (key: string, versionId?: string | null) => boolean;
  toggleSelection: (object: SelectedObject) => void;
  selectAll: (objects: SelectedObject[]) => void;
  clearSelection: () => void;
  selectedCount: number;
  getSelectedObjects: () => SelectedObject[];
}

const ObjectSelectionContext = createContext<ObjectSelectionContextValue | null>(
  null,
);

const getSelectionKey = (key: string, versionId?: string | null) =>
  `${key}-${versionId || 'latest'}`;

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

  const toggleSelection = useCallback((object: SelectedObject) => {
    setSelectedObjects((prev) => {
      const newMap = new Map(prev);
      const mapKey = getSelectionKey(object.key, object.versionId);
      if (newMap.has(mapKey)) {
        newMap.delete(mapKey);
      } else {
        newMap.set(mapKey, object);
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
      toggleSelection,
      selectAll,
      clearSelection,
      selectedCount: selectedObjects.size,
      getSelectedObjects,
    }),
    [
      selectedObjects,
      isSelected,
      toggleSelection,
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

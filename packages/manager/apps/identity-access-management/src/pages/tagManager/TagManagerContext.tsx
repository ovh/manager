import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useContext,
} from 'react';
import { IamTagListItem } from '@/data/api/get-iam-tags';

export type TagManagerContextType = {
  isShowSystemChecked: boolean;
  toggleSystemCheck: () => void;
  isShowUnassignedResourcesChecked: boolean;
  toggleUnassignedResources: () => void;
  setSelectedTagsList: (tag: IamTagListItem[]) => void;
  selectedTagsList: IamTagListItem[];
};

const TagManagerContext = createContext<TagManagerContextType | null>(null);

export const useTagManagerContext = (): TagManagerContextType => {
  const context = useContext(TagManagerContext);
  if (!context) {
    throw new Error(
      'useTagManagerContext must be used within a <TagManagerContextProvider>',
    );
  }
  return context;
};

export const TagManagerContextProvider = ({ children }: PropsWithChildren) => {
  const [isShowSystemChecked, setIsShowSystemChecked] = useState<boolean>(
    false,
  );
  const [
    isShowUnassignedResourcesChecked,
    setIsShowUnassignedResourcesChecked,
  ] = useState<boolean>(false);

  const [selectedTagsList, setSelectedTagsList] = useState<IamTagListItem[]>(
    [],
  );

  const tagManagerContext = useMemo(
    () => ({
      isShowSystemChecked,
      toggleSystemCheck: () => {
        setIsShowSystemChecked(!isShowSystemChecked);
      },
      isShowUnassignedResourcesChecked,
      toggleUnassignedResources: () => {
        setIsShowUnassignedResourcesChecked(!isShowUnassignedResourcesChecked);
      },
      selectedTagsList,
      setSelectedTagsList,
    }),
    [
      isShowSystemChecked,
      isShowUnassignedResourcesChecked,
      JSON.stringify(selectedTagsList),
    ],
  );

  return (
    <TagManagerContext.Provider value={tagManagerContext}>
      {children}
    </TagManagerContext.Provider>
  );
};

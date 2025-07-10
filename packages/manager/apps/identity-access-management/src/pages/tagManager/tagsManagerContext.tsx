import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
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

export const TagManagerContext = createContext<TagManagerContextType | null>(
  null,
);

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

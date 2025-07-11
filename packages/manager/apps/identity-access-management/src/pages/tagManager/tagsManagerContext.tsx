import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';

export type TagManagerContextType = {
  isShowSystemChecked: boolean;
  toggleSystemCheck: () => void;
  isShowUnassignedResourcesChecked: boolean;
  toggleUnassignedResources: () => void;
  toggleSelectTag: (tag: string) => void;
  selectedTagsList: string[];
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

  const [selectedTagsList, setSelectedTagsList] = useState<string[]>([]);

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
      toggleSelectTag: (tag: string) => {
        const newSelectedTagsList = selectedTagsList;
        if (!newSelectedTagsList.includes(tag)) {
          newSelectedTagsList.push(tag);
        } else {
          newSelectedTagsList.splice(newSelectedTagsList.indexOf(tag), 1);
        }
        newSelectedTagsList.push(tag);
        setSelectedTagsList(newSelectedTagsList);
      },
    }),
    [isShowSystemChecked, isShowUnassignedResourcesChecked],
  );

  return (
    <TagManagerContext.Provider value={tagManagerContext}>
      {children}
    </TagManagerContext.Provider>
  );
};

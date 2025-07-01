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
    }),
    [isShowSystemChecked, isShowUnassignedResourcesChecked],
  );

  return (
    <TagManagerContext.Provider value={tagManagerContext}>
      {children}
    </TagManagerContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';

type Props = {
  isResponsiveSidebarMenuOpen: boolean;
  setIsResponsiveSidebarMenuOpen: (isOpen: boolean) => void;
};

const LegacyContainerContext = createContext<Props>(undefined);

export function LegacyContainerProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [
    isResponsiveSidebarMenuOpen,
    setIsResponsiveSidebarMenuOpen,
  ] = useState(false);

  return (
    <LegacyContainerContext.Provider
      value={{
        isResponsiveSidebarMenuOpen,
        setIsResponsiveSidebarMenuOpen,
      }}
    >
      {children}
    </LegacyContainerContext.Provider>
  );
}

export function useLegacyContainer() {
  return useContext(LegacyContainerContext);
}

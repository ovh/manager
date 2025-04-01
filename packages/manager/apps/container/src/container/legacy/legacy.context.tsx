import { createContext, useContext, useState } from 'react';

type LegacyContainerContextType = {
  isResponsiveSidebarMenuOpen: boolean;
  setIsResponsiveSidebarMenuOpen: (isOpen: boolean) => void;
};

const LegacyContainerContext = createContext<LegacyContainerContextType | null>(
  null,
);

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
  const legacyContainerContext = useContext(LegacyContainerContext);
  if (!legacyContainerContext) {
    throw new Error(
      'useLegacyContainer must be used within a LegacyContainerProvider',
    );
  }

  return legacyContainerContext;
}

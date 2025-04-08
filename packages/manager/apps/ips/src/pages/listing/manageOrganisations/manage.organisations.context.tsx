import React, {
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useState,
  useMemo,
} from 'react';
import { OrgDetails } from '@/data/api';

type ContextType = {
  orgDetails: OrgDetails;
  setOrgDetails: (orgDetails: OrgDetails) => void;
};

export const ManageOrgListingContext = createContext<ContextType>({
  orgDetails: {},
  setOrgDetails: () => null,
});

export const ManageOrgListingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [orgDetails, setOrgDetails] = useState<OrgDetails>();

  const listingContext = useMemo(() => ({ orgDetails, setOrgDetails }), [
    orgDetails,
  ]);

  return (
    <ManageOrgListingContext.Provider value={listingContext}>
      {children}
    </ManageOrgListingContext.Provider>
  );
};

export const useManageOrgListingContext = (): ContextType => {
  const context = useContext(ManageOrgListingContext);
  if (context === undefined) {
    throw new Error(
      'useManageOrgListingContext must be used within a ManageOrgListingContextProvider',
    );
  }
  return context;
};

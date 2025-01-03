import React from 'react';
import { IpOffer, IpVersion } from './order.constant';

export type OrderContextType = {
  ipVersion?: IpVersion;
  setIpVersion: React.Dispatch<React.SetStateAction<IpVersion>>;
  selectedService?: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  selectedRegion?: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedOffer?: IpOffer;
  setSelectedOffer: React.Dispatch<React.SetStateAction<IpOffer>>;
  selectedPlanCode?: string;
  setSelectedPlanCode: React.Dispatch<React.SetStateAction<string>>;
  selectedGeolocation?: string;
  setSelectedGeolocation: React.Dispatch<React.SetStateAction<string>>;
  selectedOrganisation?: string;
  setSelectedOrganisation: React.Dispatch<React.SetStateAction<string>>;
};

export const OrderContext = React.createContext<OrderContextType>({
  setIpVersion: () => null,
  setSelectedService: () => null,
  setSelectedRegion: () => null,
  setSelectedOffer: () => null,
  setSelectedPlanCode: () => null,
  setSelectedGeolocation: () => null,
  setSelectedOrganisation: () => null,
});

export const OrderContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ipVersion, setIpVersion] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  const [selectedOffer, setSelectedOffer] = React.useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = React.useState(null);
  const [selectedGeolocation, setSelectedGeolocation] = React.useState(null);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);

  return (
    <OrderContext.Provider
      value={{
        ipVersion,
        setIpVersion,
        selectedService,
        setSelectedService,
        selectedRegion,
        setSelectedRegion,
        selectedOffer,
        setSelectedOffer,
        selectedPlanCode,
        setSelectedPlanCode,
        selectedGeolocation,
        setSelectedGeolocation,
        selectedOrganisation,
        setSelectedOrganisation,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

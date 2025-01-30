import React from 'react';
import { IpOffer, IpVersion } from './order.constant';
import { getCountryCode } from '@/components/RegionSelector/region-selector.utils';
import { ServiceType } from '@/types';

export type OrderContextType = {
  ipVersion?: IpVersion;
  setIpVersion: React.Dispatch<React.SetStateAction<IpVersion>>;
  selectedService?: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  selectedServiceType: ServiceType;
  setSelectedServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
  selectedRegion?: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedOffer?: IpOffer;
  setSelectedOffer: React.Dispatch<React.SetStateAction<IpOffer>>;
  selectedPlanCode?: string;
  setSelectedPlanCode: React.Dispatch<React.SetStateAction<string>>;
  ipQuantity: number;
  setIpQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedGeolocation?: string;
  setSelectedGeolocation: React.Dispatch<React.SetStateAction<string>>;
  selectedOrganisation?: string;
  setSelectedOrganisation: React.Dispatch<React.SetStateAction<string>>;
};

export const OrderContext = React.createContext<OrderContextType>({
  setIpVersion: () => null,
  setSelectedService: () => null,
  selectedServiceType: ServiceType.unknown,
  setSelectedServiceType: () => null,
  setSelectedRegion: () => null,
  setSelectedOffer: () => null,
  setSelectedPlanCode: () => null,
  ipQuantity: 1,
  setIpQuantity: () => null,
  setSelectedGeolocation: () => null,
  setSelectedOrganisation: () => null,
});

export const OrderContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ipVersion, setIpVersion] = React.useState(null);
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedServiceType, setSelectedServiceType] = React.useState(
    ServiceType.unknown,
  );
  const [selectedRegion, setSelectedRegion] = React.useState(null);
  const [selectedOffer, setSelectedOffer] = React.useState(null);
  const [selectedPlanCode, setSelectedPlanCode] = React.useState(null);
  const [ipQuantity, setIpQuantity] = React.useState(1);
  const [selectedGeolocation, setSelectedGeolocation] = React.useState(null);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);

  const value = React.useMemo(
    () => ({
      ipVersion,
      setIpVersion,
      selectedService,
      setSelectedService,
      selectedServiceType,
      setSelectedServiceType: (serviceType: ServiceType) => {
        setSelectedServiceType(serviceType);
        setSelectedRegion(null);
        setSelectedOffer(null);
      },
      selectedRegion,
      setSelectedRegion: (newRegion: string) => {
        setSelectedRegion(newRegion);
        setSelectedOffer(null);
      },
      selectedOffer,
      setSelectedOffer: (newOffer: IpOffer) => {
        const code = getCountryCode(selectedRegion);
        setSelectedGeolocation(code === 'gb' ? 'uk' : code);
        setSelectedOffer(newOffer);
      },
      selectedPlanCode,
      setSelectedPlanCode,
      ipQuantity,
      setIpQuantity,
      selectedGeolocation,
      setSelectedGeolocation,
      selectedOrganisation,
      setSelectedOrganisation,
    }),
    [
      ipVersion,
      selectedService,
      selectedServiceType,
      selectedRegion,
      selectedOffer,
      selectedPlanCode,
      ipQuantity,
      selectedGeolocation,
      selectedOrganisation,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

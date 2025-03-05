import React from 'react';
import { DEFAULT_PRICING_MODE, IpOffer, IpVersion } from './order.constant';
import { getCountryCode } from '@/components/RegionSelector/region-selector.utils';
import { ServiceType } from '@/types';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';

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
  pricingMode?: string;
  setPricingMode: React.Dispatch<React.SetStateAction<string>>;
  ipQuantity: number;
  setIpQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedGeolocation?: string;
  setSelectedGeolocation: React.Dispatch<React.SetStateAction<string>>;
  selectedOrganisation?: string;
  setSelectedOrganisation: React.Dispatch<React.SetStateAction<string>>;
  disabledServices: string[];
  addDisabledService?: (serviceName: string) => void;
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
  pricingMode: DEFAULT_PRICING_MODE,
  setPricingMode: () => null,
  setIpQuantity: () => null,
  setSelectedGeolocation: () => null,
  setSelectedOrganisation: () => null,
  disabledServices: [],
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
  const [pricingMode, setPricingMode] = React.useState(DEFAULT_PRICING_MODE);
  const [ipQuantity, setIpQuantity] = React.useState(1);
  const [selectedGeolocation, setSelectedGeolocation] = React.useState(null);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);
  const [disabledServices, setDisabledServices] = React.useState([]);
  const { region } = useServiceRegion({
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  const value = React.useMemo(
    () => ({
      ipVersion,
      setIpVersion: (version: IpVersion) => {
        setIpVersion(version);
        setSelectedService(null);
        setSelectedServiceType(null);
        setSelectedRegion(null);
      },
      selectedService,
      setSelectedService: (service: string) => {
        setSelectedService(service);
        setSelectedRegion(null);
      },
      selectedServiceType,
      setSelectedServiceType: (serviceType: ServiceType) => {
        setSelectedOffer(null);
        setSelectedPlanCode(null);
        setSelectedServiceType(serviceType);
      },
      selectedRegion,
      setSelectedRegion: (newRegion: string) => {
        setSelectedRegion(newRegion);
        setSelectedOffer(null);
      },
      selectedOffer,
      setSelectedOffer: (newOffer: IpOffer) => {
        const code = getCountryCode(region || selectedRegion);
        setSelectedGeolocation(
          code === 'gb' &&
            [ServiceType.vrack, ServiceType.ipParking].includes(
              selectedServiceType,
            )
            ? 'uk'
            : code,
        );
        setSelectedOffer(newOffer);
        if (newOffer === IpOffer.blockAdditionalIp) {
          setIpQuantity(1);
        }
      },
      selectedPlanCode,
      setSelectedPlanCode,
      pricingMode,
      setPricingMode,
      ipQuantity,
      setIpQuantity,
      selectedGeolocation,
      setSelectedGeolocation,
      selectedOrganisation,
      setSelectedOrganisation,
      disabledServices,
      addDisabledService: (serviceName: string) =>
        setDisabledServices((serviceList) =>
          Array.from(new Set([...serviceList, serviceName])),
        ),
    }),
    [
      ipVersion,
      selectedService,
      selectedServiceType,
      selectedRegion,
      selectedOffer,
      selectedPlanCode,
      pricingMode,
      ipQuantity,
      selectedGeolocation,
      selectedOrganisation,
      disabledServices,
      region,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

import React from 'react';
import { DEFAULT_PRICING_MODE, IpOffer, Ipv6Options } from './order.constant';
import { getCountryCode } from '@/components/RegionSelector/region-selector.utils';
import { IpVersion, ServiceType } from '@/types';
import { useServiceRegion } from '@/data/hooks/useServiceRegion';

export type OrderContextType = Partial<{
  ipVersion: IpVersion;
  setIpVersion: React.Dispatch<React.SetStateAction<IpVersion>>;
  selectedService: string;
  setSelectedService: React.Dispatch<React.SetStateAction<string>>;
  selectedServiceType: ServiceType;
  setSelectedServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
  selectedOptions: Ipv6Options[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Ipv6Options[]>>;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedOffer: IpOffer;
  setSelectedOffer: React.Dispatch<React.SetStateAction<IpOffer>>;
  selectedPlanCode: string;
  setSelectedPlanCode: React.Dispatch<React.SetStateAction<string>>;
  pricingMode: string;
  setPricingMode: React.Dispatch<React.SetStateAction<string>>;
  ipQuantity: number;
  setIpQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedGeolocation: string;
  setSelectedGeolocation: React.Dispatch<React.SetStateAction<string>>;
  selectedOrganisation: string;
  setSelectedOrganisation: React.Dispatch<React.SetStateAction<string>>;
  disabledServices: string[];
  addDisabledService: (serviceName: string) => void;
}>;

export const OrderContext = React.createContext<OrderContextType>({
  selectedServiceType: ServiceType.unknown,
  ipQuantity: 1,
  pricingMode: DEFAULT_PRICING_MODE,
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
  const [selectedOptions, setSelectedOptions] = React.useState<Ipv6Options[]>(
    [],
  );
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
        setSelectedGeolocation(null);
        setSelectedOrganisation(null);
        setSelectedPlanCode(null);
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
      selectedOptions,
      setSelectedOptions,
      selectedRegion,
      setSelectedRegion: (newRegion: string) => {
        setSelectedRegion(newRegion);
        setSelectedOffer(null);
        setSelectedPlanCode(null);
      },
      selectedOffer,
      setSelectedOffer: (newOffer: IpOffer) => {
        const code = getCountryCode(region || selectedRegion);
        setSelectedGeolocation(
          code === 'gb' && selectedServiceType !== ServiceType.dedicatedCloud
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
      selectedOptions,
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

import React from 'react';

import { useServiceRegion } from '@/data/hooks/useServiceRegion';
import { IpVersion, ServiceType } from '@/types';
import { getCountryCode } from '@/utils';

import { DEFAULT_PRICING_MODE, IpOffer, Ipv6Options } from './order.constant';

export type OrderContextType = {
  ipVersion?: IpVersion;
  setIpVersion: (version?: IpVersion) => void;
  selectedService?: string;
  setSelectedService: (service?: string) => void;
  selectedServiceType?: ServiceType;
  setSelectedServiceType: (serviceType?: ServiceType) => void;
  selectedOptions?: Ipv6Options[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<Ipv6Options[]>>;
  selectedRegion?: string;
  setSelectedRegion: (region?: string) => void;
  selectedOffer?: IpOffer;
  setSelectedOffer: (offer?: IpOffer) => void;
  selectedPlanCode?: string;
  setSelectedPlanCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  pricingMode?: string;
  setPricingMode: React.Dispatch<React.SetStateAction<string>>;
  ipQuantity?: number;
  setIpQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedGeolocation?: string;
  setSelectedGeolocation: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedOrganisation?: string;
  setSelectedOrganisation: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  disabledServices: string[];
  addDisabledService: (serviceName?: string | null) => void;
};

export const OrderContext = React.createContext<OrderContextType>({
  setIpVersion: () => {},
  setSelectedService: () => {},
  selectedOptions: [],
  setSelectedOptions: () => {},
  setSelectedRegion: () => {},
  setSelectedOffer: () => {},
  setSelectedPlanCode: () => {},
  setPricingMode: () => {},
  setIpQuantity: () => {},
  setSelectedGeolocation: () => {},
  setSelectedOrganisation: () => {},
  setSelectedServiceType: () => {},
  selectedServiceType: ServiceType.unknown,
  ipQuantity: 1,
  pricingMode: DEFAULT_PRICING_MODE,
  disabledServices: [],
  addDisabledService: () => {},
});

export const OrderContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ipVersion, setIpVersion] = React.useState<IpVersion | undefined>(
    undefined,
  );
  const [selectedService, setSelectedService] = React.useState<
    string | undefined
  >(undefined);
  const [selectedServiceType, setSelectedServiceType] = React.useState<
    ServiceType | undefined
  >(undefined);
  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >(undefined);
  const [selectedOffer, setSelectedOffer] = React.useState<IpOffer | undefined>(
    undefined,
  );
  const [selectedPlanCode, setSelectedPlanCode] = React.useState<
    string | undefined
  >(undefined);
  const [pricingMode, setPricingMode] =
    React.useState<string>(DEFAULT_PRICING_MODE);
  const [ipQuantity, setIpQuantity] = React.useState(1);
  const [selectedGeolocation, setSelectedGeolocation] = React.useState<
    string | undefined
  >(undefined);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState<
    string | undefined
  >(undefined);
  const [disabledServices, setDisabledServices] = React.useState<string[]>([]);
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
      setIpVersion: (version?: IpVersion) => {
        setIpVersion(version);
        setSelectedService(undefined);
        setSelectedServiceType(undefined);
        setSelectedRegion(undefined);
        setSelectedGeolocation(undefined);
        setSelectedOrganisation(undefined);
        setSelectedPlanCode(undefined);
      },
      selectedService,
      setSelectedService: (service?: string) => {
        setSelectedService(service);
        setSelectedRegion(undefined);
      },
      selectedServiceType,
      setSelectedServiceType: (serviceType?: ServiceType) => {
        setSelectedOffer(undefined);
        setSelectedPlanCode(undefined);
        setSelectedServiceType(serviceType);
      },
      selectedOptions,
      setSelectedOptions,
      selectedRegion,
      setSelectedRegion: (newRegion?: string) => {
        setSelectedRegion(newRegion);
        setSelectedOffer(undefined);
        setSelectedPlanCode(undefined);
      },
      selectedOffer,
      setSelectedOffer: (newOffer?: IpOffer) => {
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
      addDisabledService: (serviceName?: string | null) => {
        if (serviceName) {
          setDisabledServices((serviceList) =>
            Array.from(new Set([...serviceList, serviceName])),
          );
        }
      },
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

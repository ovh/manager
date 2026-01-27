import { Control, UseFormWatch } from 'react-hook-form';

import { AttachedDomainProps, HostingCountries } from '@/data/types/product/webHosting';
import { ServiceStatus } from '@/data/types/status';

export interface FormValues {
  selectedCountryIp: HostingCountries;
  domain: string;
  path: string;
  cdn: ServiceStatus;
  firewall: ServiceStatus;
  ipLocation?: HostingCountries;
  countriesIpEnabled: boolean;
  enableOwnLog: boolean;
  ownLog: string;
}

export interface CountryIp {
  country: HostingCountries;
  ip?: string;
  ipv6?: string;
}

export interface Step1Props {
  control: Control<FormValues>;
  isGitDisabled: boolean;
  watch: UseFormWatch<FormValues>;
  domainDetails?: AttachedDomainProps;
  hosting: {
    hostingIp?: string;
    countriesIp?: CountryIp[];
    hasHostedSsl?: boolean;
  } | null;
  zones: string[];
}

export interface Step2Props {
  watch: UseFormWatch<FormValues>;
  hosting: {
    countriesIp?: CountryIp[];
    hasHostedSsl?: boolean;
  } | null;
}

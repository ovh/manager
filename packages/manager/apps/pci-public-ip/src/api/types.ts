export enum IPTypeEnum {
  FAILOVER = 'failover_ip',
  FLOATING = 'floating_ip',
}

export type TIpType = {
  name: string;
  label: string;
  description: string;
  price: string;
};

export type TIpAddress = {
  gatewayIp: string;
  ip: string;
  networkId: string;
  type: string;
  version: number;
};

export type TCountry = {
  name: string;
  planCode: string;
  regionNames: string[];
};

export type TRegion = {
  continentCode: string;
  datacenter: string;
  enabled: string;
  name: string;
  macroName: string;
  microName: string;
  continent: string;
};

export enum StepIdsEnum {
  IP_TYPE = 'IP_TYPE',
  FAILOVER_COUNTRY = 'FAILOVER_COUNTRY',
  FAILOVER_INSTANCE = 'FAILOVER_INSTANCE',
  FLOATING_REGION = 'FLOATING_REGION',
  FLOATING_INSTANCE = 'FLOATING_INSTANCE',
  FLOATING_SUMMARY = 'FLOATING_SUMMARY',
}

export type TInstance = {
  id: string;
  name: string;
  region: string;
  ipAddresses: TIpAddress[];
};

export type TFormState = {
  ipType: IPTypeEnum;
  failoverCountry?: TCountry;
  floatingRegion?: TRegion;
  floatingGatewaySize: string;
  instance?: TInstance;
  ipAddress?: TIpAddress;
};

export type TStepState = {
  id: string;
  key: string;
  title: string;
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
};

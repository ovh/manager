import { StatusEnum } from '../enum/Status.enum';

export interface TDnssecConfiguration {
  dnssecSupported: boolean;
  supportedAlgorithms?: {
    name: string;
    number: number;
  }[];
  dsData?: TDsDataInterface[];
}

export interface TDsDataInterface {
  algorithm: number;
  keyTag: number;
  flags: number;
  publicKey: string;
  supportedAlgorithm?: {
    name: string;
    number: number;
  };
  status?: StatusEnum;
}

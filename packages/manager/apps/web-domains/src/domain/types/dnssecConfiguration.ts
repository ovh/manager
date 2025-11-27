export interface TDnssecConfiguration {
  dnssecSupported: boolean;
  supportedAlgorithms: {
    name: string;
    number: number;
  }[];
  dsData?: TDsDataInterface[];
}

export interface TDsDataInterface {
  algorithm: number;
  keyTag: number;
  keyType: number;
  publicKey: string;
  supportedAlgorithm?: {
    name: string;
    number: number;
  };
}

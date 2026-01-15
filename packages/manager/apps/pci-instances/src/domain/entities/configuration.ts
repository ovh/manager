type TMicroRegionID = string;

export type TSshKey = {
  name: string;
  regions: string[];
};

export type TBackupPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
  type: 'hour' | 'month';
};

export type TBackupConfiguration = {
  region: TMicroRegionID;
  autoBackupEnabled: boolean;
  prices: TBackupPrice[];
};

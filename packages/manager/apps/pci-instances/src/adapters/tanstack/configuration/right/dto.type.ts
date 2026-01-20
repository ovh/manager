export type TSshKeyDTO = {
  name: string;
  regions: string[];
};

type TBackupRegionDTO = {
  name: string;
  distantAutoBackupEnabled: boolean;
};

type TBackupPriceDTO = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

type TBackupPricingDTO = {
  regions: string[];
  price: TBackupPriceDTO;
  interval: 'hour' | 'month';
};

type TBackupModelDTO = {
  name: string;
  pricings: TBackupPricingDTO[];
};

export type TBackupConfigurationDTO = {
  regions: TBackupRegionDTO[];
  models: TBackupModelDTO[];
};

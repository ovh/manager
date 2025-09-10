export enum PriceTextPreset {
  BASE = 'base_price',
  WITH_TAX = 'price_including_tax',
}

export type PriceTextProps = {
  preset?: PriceTextPreset;
  price: string;
  label?: string;
  intervalUnitText?: string;
};

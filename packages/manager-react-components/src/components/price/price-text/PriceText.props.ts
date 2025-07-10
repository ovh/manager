export enum PRICE_TEXT_PRESET {
  BASE = 'base_price',
  WITH_TAX = 'price_including_tax',
}

export type PriceTextProps = {
  preset?: PRICE_TEXT_PRESET;
  price: string;
  label?: string;
  intervalUnitText?: string;
};

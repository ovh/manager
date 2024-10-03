import { useMe } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TPricing } from '../api/data';
import '../translations/catalog-price';

const DEFAULT_DECIMALS = 2;
const UCENTS = 1 / 100_000_000;
const ASIA_FORMAT = ['SG', 'ASIA', 'AU', 'IN'];
const FRENCH_FORMAT = [
  'CZ',
  'ES',
  'FR',
  'GB',
  'IE',
  'IT',
  'LT',
  'MA',
  'NL',
  'PL',
  'PT',
  'TN',
];
const GERMAN_FORMAT = ['DE', 'FI', 'SN'];

export interface PriceFormattingOptions {
  decimals?: number; // how many decimals to display
  unit?: number; // price format unit (defaults to UCENT)
  // force display of interval unit instead of using intervalUnit from Pricing object
  intervalUnit?: TPricing['intervalUnit'];
}

/**
 * Primary & secondary price parts depends on user region.
 * ASIA, FRENCH : primary = price without tax, secondary = price + tax
 * GERMAN : primary : price + tax, secondary = none
 * US, OTHER : primary: price without tax
 */
export interface PriceDetails {
  primary: string;
  secondary?: string;
  interval?: string;
}

/**
 * Hook to facillitates price formatting coming from /order/catalog/public
 */
export function usePricing() {
  const { i18n, t } = useTranslation('pci-catalog-price');
  const { me } = useMe();

  const formatPrice = (
    price: number,
    options: PriceFormattingOptions,
  ): string => {
    if (!me) return '';
    const numberFormatOptions = {
      style: 'currency',
      currency: me?.currency?.code,
      maximumFractionDigits:
        options?.decimals >= 0 ? options?.decimals : DEFAULT_DECIMALS,
    };
    const unit = options?.unit >= 1 ? options?.unit : UCENTS;
    try {
      return new Intl.NumberFormat(
        i18n.language?.replace('_', '-'),
        numberFormatOptions as Parameters<typeof Intl.NumberFormat>[1],
      ).format(price * unit);
    } catch {
      return new Intl.NumberFormat(
        'en-GB',
        numberFormatOptions as Parameters<typeof Intl.NumberFormat>[1],
      ).format(price * unit);
    }
  };

  const getPriceDetails = (
    pricing: TPricing,
    options?: Readonly<PriceFormattingOptions>,
  ): PriceDetails => {
    if (!me) {
      return {
        primary: '',
        secondary: '',
        interval: '',
      };
    }
    const { price, tax } = pricing;
    const decimals = options?.decimals;
    const hasInterval =
      options?.intervalUnit ||
      (pricing.intervalUnit !== 'none' && pricing.interval > 0);
    const intervalUnit = t(
      `order_catalog_price_interval_${options?.intervalUnit ||
        pricing.intervalUnit}`,
    );
    const intervalLabel = hasInterval
      ? `${pricing.interval > 1 ? `${pricing.interval} ` : ''}${intervalUnit}`
      : '';
    const isAsia = ASIA_FORMAT.includes(me.ovhSubsidiary);
    const isFrench = FRENCH_FORMAT.includes(me.ovhSubsidiary);
    const isGerman = GERMAN_FORMAT.includes(me.ovhSubsidiary);

    if (isAsia || isFrench) {
      const taxFormat = isAsia ? 'gst' : 'tax';
      return {
        primary: t(`order_catalog_price_${taxFormat}_excl_label`, {
          price: formatPrice(price, { decimals }),
        }),
        secondary: t(`order_catalog_price_${taxFormat}_incl_label`, {
          price: formatPrice(price + tax, { decimals }),
        }),
        interval: intervalLabel,
      };
    }

    if (isGerman) {
      return {
        primary: formatPrice(price + tax, { decimals }),
        interval: intervalLabel,
      };
    }

    return {
      primary: formatPrice(price, { decimals }),
      interval: intervalLabel,
    };
  };

  const getTextPrice = (
    pricing: TPricing,
    options?: Readonly<PriceFormattingOptions>,
  ): string => {
    if (!me || !pricing) return '';
    const { primary, secondary, interval } = getPriceDetails(pricing, options);
    return `${primary}${secondary ? ` (${secondary})` : ''}${
      interval ? ` / ${interval}` : ''
    }`;
  };

  return {
    formatPrice,
    getPriceDetails,
    getTextPrice,
  };
}

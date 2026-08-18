import { CatalogPricing, OrderCatalog } from '@/types/Catalog.type';

const isActivationFee = (pricing: CatalogPricing): boolean =>
  pricing.capacities?.includes('installation') === true &&
  !pricing.capacities.includes('consumption');

/**
 * Prix catalogue par défaut d'un plan (sans engagement). Les plans `backupServices` sont en
 * `pricingType: 'consumption'` : `intervalUnit`/`interval` valent `'none'`/`0` dans la réponse
 * réelle (cf. `consumptionConfiguration.prorataUnit`), donc `mode === 'default'` combiné à
 * `commitment === 0` est le seul filtre fiable — pas `intervalUnit`/`interval`.
 */
export const getDefaultPricing = (
  catalog: OrderCatalog | undefined,
  planCode: string,
): CatalogPricing | undefined => {
  // Les licences sont des addons du tenant : les chercher parmi les plans ne rend jamais de prix.
  const plan = [...(catalog?.plans ?? []), ...(catalog?.addons ?? [])].find(
    (candidate) => candidate.planCode === planCode,
  );
  return plan?.pricings.find(
    (pricing) =>
      pricing.mode === 'default' && pricing.commitment === 0 && !isActivationFee(pricing),
  );
};

const UCENTS_PER_UNIT = 100_000_000;

/**
 * Le montant tel qu'Agora le chiffre, sans l'arrondir au centime. `formattedPrice` du catalogue et
 * le composant `Price` fixent tous deux deux décimales : un tarif au Gio de 0,007 € s'y affiche
 * « 0,01 € ». D'où le minimum habituel de deux décimales, porté à quatre quand le tarif descend
 * sous le centime — les zéros non significatifs, eux, ne sont pas rendus.
 */
export const formatCatalogPrice = (
  priceInUcents: number,
  currencyCode: string,
  locale: string,
): string =>
  new Intl.NumberFormat(locale.replace('_', '-'), {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(priceInUcents / UCENTS_PER_UNIT);

/** Prix catalogue par défaut le plus bas parmi plusieurs plans (ex. « à partir de » toutes licences confondues). */
export const getLowestPricing = (
  catalog: OrderCatalog | undefined,
  planCodes: string[],
): CatalogPricing | undefined =>
  planCodes
    .map((planCode) => getDefaultPricing(catalog, planCode))
    .filter((pricing): pricing is CatalogPricing => pricing !== undefined)
    .reduce<CatalogPricing | undefined>(
      (lowest, pricing) => (!lowest || pricing.price < lowest.price ? pricing : lowest),
      undefined,
    );

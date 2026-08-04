import { CatalogPricing, OrderCatalog } from '@/types/Catalog.type';

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
  const plan = catalog?.plans.find((candidate) => candidate.planCode === planCode);
  return plan?.pricings.find((pricing) => pricing.mode === 'default' && pricing.commitment === 0);
};

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

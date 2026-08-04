/**
 * Sous-ensemble du catalogue Agora public (`GET /order/catalog/public/{productLine}`),
 * cf. BKP-1208 §Technical. Champs réellement consommés seulement — le contrat complet
 * est documenté dans `packages/manager/modules/vcd-api/src/types/veeam-backup-catalog.type.ts`
 * (produit Veeam sœur, même forme de catalogue).
 */
export interface CatalogPricing {
  /** `'default'` = prix catalogue sans engagement (cf. `pricingMode` du snippet `createCart` du ticket). */
  mode: string;
  /**
   * Durée d'engagement, en mois. `0` = sans engagement. Les plans `backupServices` sont en
   * `pricingType: 'consumption'` (facturés à la conso, `intervalUnit: 'none'`/`interval: 0`
   * dans la réponse réelle) : `mode`/`commitment` sont donc les seuls critères fiables pour
   * isoler le prix catalogue par défaut, pas `intervalUnit`/`interval`.
   */
  commitment: number;
  intervalUnit: string;
  interval: number;
  /** Prix hors taxes, en micro-centimes (à diviser par 100_000_000 pour obtenir l'unité monétaire). */
  price: number;
  /** Taxe, même unité que `price`. */
  tax: number;
}

export interface CatalogPlan {
  planCode: string;
  pricings: CatalogPricing[];
}

export interface CatalogLocale {
  currencyCode: string;
  taxRate: number;
}

export interface OrderCatalog {
  plans: CatalogPlan[];
  locale: CatalogLocale;
}

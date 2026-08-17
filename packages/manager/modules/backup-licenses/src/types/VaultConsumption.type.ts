/** Ligne du tableau « Facturation » (§4 de la spec BKP-1225). Une ligne = un vault. */
export type VaultConsumptionRow = {
  vaultId: string;
  name: string;
  /** Volume consommé sur la période de facturation en cours, déjà en Go côté API. */
  quantityGb?: number;
  /**
   * Volume inclus (500 Go) si ce vault est sur le plan bundle, `undefined` pour un vault
   * paygo qui n'a aucun volume inclus.
   */
  includedStorageGb?: number;
  /** Prix du stockage du vault, montant formaté par l'API (devise et séparateurs inclus). */
  storagePriceText?: string;
  /** Sert à distinguer « inclus » (0) d'« inconnu » (undefined) — cf. §7. */
  storagePriceValue?: number;
  /**
   * Prix de la licence rattachée au vault (via son serveur), formaté par l'API.
   * `undefined` si la résolution échoue ou si aucune licence n'est appariée.
   */
  licensePriceText?: string;
};

/** Période de facturation couverte par les éléments de consommation résolus. */
export type BillingPeriod = {
  beginDate: string | null;
  endDate: string | null;
};

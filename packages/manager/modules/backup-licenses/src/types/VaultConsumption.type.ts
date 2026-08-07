/**
 * Ligne du tableau « Vaults » de l'onglet Facturation. Une ligne = un vault : licences et
 * vaults sont deux ressources sans cardinalité fixe entre elles (X licences pour 1 vault, ou
 * l'inverse), donc pas de colonne prix licence ici — cf. `LicenseConsumptionRow`.
 */
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
};

/** Ligne du tableau « Licences » de l'onglet Facturation. Une ligne = une licence. */
export type LicenseConsumptionRow = {
  licenseId: string;
  name: string;
  /** Prix de la licence, montant formaté par l'API. `undefined` si la résolution échoue. */
  licensePriceText?: string;
};

/** Période de facturation couverte par les éléments de consommation résolus. */
export type BillingPeriod = {
  beginDate: string | null;
  endDate: string | null;
};

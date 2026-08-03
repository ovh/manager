/**
 * Aucun champ ne porte de libellé de région et `common.RegionEnum` compte 48 membres : seul le
 * sous-ensemble que cette offre provisionne est mappé, le reste retombe sur le code brut, qui reste
 * lisible. Les clés alimentent les libellés de ville du namespace partagé `region`.
 */
export const VAULT_REGION_I18N_KEYS: Record<string, string> = Object.freeze({
  'eu-west-gra': 'gra',
  'eu-west-par': 'par',
  'eu-west-rbx': 'rbx',
  'eu-west-sbg': 'sbg',
});

/** La casse varie selon la source : le contrat publie `eu-west-par`, les fixtures `EU-WEST-PAR`. */
export const getVaultRegionI18nKey = (region: string): string | undefined =>
  VAULT_REGION_I18N_KEYS[region?.toLowerCase()];

export const formatVaultRegions = (
  regions: string[],
  translateRegion: (region: string) => string,
): string => regions.map(translateRegion).join(', ');

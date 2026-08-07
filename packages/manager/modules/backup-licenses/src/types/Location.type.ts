/**
 * Localisation d'un vault. Catalogue en dur (BKP-1223, cf. `data/locations.data.ts`) —
 * seuls les champs consommés par le tunnel de commande sont typés.
 */

/** Typologie générale de la région. */
export enum LocationType {
  LOCAL_ZONE = 'LOCAL-ZONE',
  REGION_1_AZ = 'REGION-1-AZ',
  REGION_3_AZ = 'REGION-3-AZ',
}

/** Typologie spécifique de la région. */
export enum LocationSpecificType {
  BACKUP = 'BACKUP',
  LZ = 'LZ',
  SNC = 'SNC',
  STANDARD = 'STANDARD',
}

export interface Location {
  /** Nom de la région, valeur envoyée à l'API de commande (ex. `eu-west-par`). */
  name: string;
  /** Code court de la région (ex. `PAR`). */
  code: string;
  /** Nom complet de la ville, traduit selon le paramètre `language`. */
  cityName: string;
  /** Code ISO de la ville. */
  cityCode: string;
  /** Code ISO du pays (ex. `FR`) — sert à dériver l'emoji drapeau. */
  countryCode: string;
  /** Nom complet du pays, traduit. */
  countryName: string;
  /** Nom de la zone géographique (ex. « Europe »), traduit. */
  geographyName: string;
  geographyCode: string;
  availabilityZones: string[];
  type: LocationType;
  specificType: LocationSpecificType;
}

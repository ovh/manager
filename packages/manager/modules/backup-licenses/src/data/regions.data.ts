import { VaultRegionData } from '@/types/Order.type';

/**
 * STUB des régions de provisionnement du Vault (cf. spec BKP-1208).
 * À REMPLACER par un chargement dynamique depuis le catalogue Agora (API non figée).
 * Pour l'instant : les 3 régions FR, en dur, pour valider la grille 3 colonnes.
 */
export const VAULT_REGIONS: VaultRegionData[] = [
  { apiValue: 'eu-west-par', flag: '🇫🇷', i18nKey: 'par' },
  { apiValue: 'eu-west-gra', flag: '🇫🇷', i18nKey: 'gra' },
  { apiValue: 'eu-west-rbx', flag: '🇫🇷', i18nKey: 'rbx' },
];

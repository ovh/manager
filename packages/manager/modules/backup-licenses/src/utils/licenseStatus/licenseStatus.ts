import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { LicenseStatus } from '@/types/BackupServer.type';

/**
 * Deux rendus possibles pour le statut d'une licence :
 * - `progress` : spinner + libellé en `information`, pour un provisionnement en cours.
 *   ODS v18 n'a pas de badge avec spinner intégré, d'où le composant maison.
 * - `badge` : `OdsBadge` coloré. `rawLabel` remplace `i18nKey` pour une valeur inconnue.
 */
export type LicenseStatusDisplay =
  | { kind: 'progress'; i18nKey: string }
  | { kind: 'badge'; color: ODS_BADGE_COLOR; i18nKey?: string; rawLabel?: string };

/**
 * Mapping du statut de licence (§8 de la spec BKP-1216).
 * Un statut absent ou `null` vaut `CREATING` : c'est une licence qui n'a pas encore été
 * provisionnée (AC explicite du ticket). En revanche une valeur *inconnue* n'est pas
 * ramenée à « en cours de création » — on ne veut pas promettre un provisionnement
 * qui n'existe peut-être pas — mais affichée telle quelle, en `information`.
 */
export const getLicenseStatusDisplay = (
  licenseStatus?: LicenseStatus | string | null,
): LicenseStatusDisplay => {
  switch (licenseStatus) {
    case LicenseStatus.UPDATING:
      return { kind: 'progress', i18nKey: 'status.updating' };
    case LicenseStatus.INSTALLED:
      return { kind: 'badge', color: ODS_BADGE_COLOR.success, i18nKey: 'status.installed' };
    case LicenseStatus.EXPIRED:
      return { kind: 'badge', color: ODS_BADGE_COLOR.critical, i18nKey: 'status.expired' };
    case LicenseStatus.NOT_SUPPORTED:
      return { kind: 'badge', color: ODS_BADGE_COLOR.critical, i18nKey: 'status.not_supported' };
    case LicenseStatus.CREATING:
    case null:
    case undefined:
    case '':
      return { kind: 'progress', i18nKey: 'status.creating' };
    default:
      return { kind: 'badge', color: ODS_BADGE_COLOR.information, rawLabel: licenseStatus };
  }
};

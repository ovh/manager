import { BackupServer } from '@/types/BackupServer.type';

/** Version VBR à partir de laquelle un changement de licence devient possible. */
const MIN_EDITABLE_VBR_MAJOR_VERSION = 13;

/** `backupServerVersion` est au format `MAJOR.MINOR` (ex. `12.1`, `13.0`) — cf. mocks BKP-1216. */
function getMajorVersion(version?: string): number | null {
  if (!version) return null;
  const major = parseInt(version, 10);
  return Number.isNaN(major) ? null : major;
}

/** Pourquoi le type de licence ne peut pas être changé, pour le message affiché à l'utilisateur. */
export type LicenseEditLockReason = 'version' | 'os' | null;

export type LicenseEditRules = {
  /** Le type de licence (Enterprise Plus / Data Platform) peut être changé. */
  canEditFamily: boolean;
  /** Le niveau Veeam Data Platform peut être changé. */
  canEditTier: boolean;
  lockReason: LicenseEditLockReason;
};

/**
 * Règles métier de changement de licence selon la version VBR et l'OS du serveur installé :
 * - version < 13 : aucun changement de licence, quel que soit l'OS (Enterprise Plus est la seule
 *   licence compatible avec les versions antérieures à 13, cf. `order:license.enterprise_plus.tag_vbr`).
 * - version >= 13 + Windows : tout est ouvert (les deux familles + les 3 niveaux VDP).
 * - version >= 13 + autre OS (Linux, `LINUX_APPLIANCE`…) : Enterprise Plus est réservé à Windows
 *   (`order:license.enterprise_plus.tag_os`) → la famille reste figée, seul le niveau VDP est modifiable.
 */
export function getLicenseEditRules(server?: BackupServer): LicenseEditRules {
  const isV13Plus =
    (getMajorVersion(server?.backupServerVersion) ?? 0) >= MIN_EDITABLE_VBR_MAJOR_VERSION;

  if (!isV13Plus) {
    return { canEditFamily: false, canEditTier: false, lockReason: 'version' };
  }
  if (server?.osType === 'WINDOWS') {
    return { canEditFamily: true, canEditTier: true, lockReason: null };
  }
  return { canEditFamily: false, canEditTier: true, lockReason: 'os' };
}

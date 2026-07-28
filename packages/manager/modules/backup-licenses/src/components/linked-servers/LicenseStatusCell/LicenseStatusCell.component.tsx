import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseStatus } from '@/types/BackupServer.type';
import { getLicenseStatusDisplay } from '@/utils/licenseStatus/licenseStatus';

interface LicenseStatusCellProps {
  licenseStatus?: LicenseStatus | string | null;
  /** Vrai si la ligne a une opération en cours (polling BKP-1220). */
  isInFlight: boolean;
  /** Vrai si une opération de la ligne s'est terminée en `ERROR`. */
  hasFailedTask?: boolean;
  /** Vrai si l'opération en cours est une suppression (BKP-1219). */
  isDeleting?: boolean;
}

/**
 * Colonne « Statut de la licence ».
 *
 * Une opération en cours force le rendu « spinner + texte », quel que soit `licenseStatus` :
 * `currentTasks` et un statut `CREATING`/`UPDATING` sont deux signaux de la même réalité
 * côté utilisateur, on ne leur donne donc qu'un seul visuel — sauf la suppression, qui a son
 * propre libellé : la ligne va disparaître, pas se rafraîchir (cf. `isServerBeingDeleted`).
 *
 * L'échec d'une opération est prioritaire sur `licenseStatus` : sinon une création ratée
 * resterait affichée « En cours de création » indéfiniment, puisque la licence n'a jamais
 * quitté l'état `CREATING` côté API.
 */
export default function LicenseStatusCell({
  licenseStatus,
  isInFlight,
  hasFailedTask = false,
  isDeleting = false,
}: LicenseStatusCellProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  if (hasFailedTask && !isInFlight) {
    return (
      <DataGridTextCell>
        <OdsBadge
          color={ODS_BADGE_COLOR.critical}
          size={ODS_BADGE_SIZE.md}
          label={t('status.error')}
        />
      </DataGridTextCell>
    );
  }

  const statusDisplay = getLicenseStatusDisplay(licenseStatus);
  // Une tâche en cours sur une licence déjà provisionnée : c'est une mise à jour — sauf
  // suppression, prioritaire, qui a son propre libellé (la ligne va disparaître).
  const display = isDeleting
    ? ({ kind: 'progress', i18nKey: 'status.deleting' } as const)
    : isInFlight && statusDisplay.kind !== 'progress'
      ? getLicenseStatusDisplay(LicenseStatus.UPDATING)
      : statusDisplay;

  if (display.kind === 'progress') {
    return (
      <DataGridTextCell>
        {/* `gap-4` = 0.5rem : l'échelle `spacing` du preset OVH n'est pas celle de Tailwind
            par défaut, où `gap-2` ne vaut que 2px — trop serré contre le libellé. */}
        <span className="flex items-center gap-4">
          <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
          <OdsText
            preset={ODS_TEXT_PRESET.span}
            className="text-[var(--ods-color-information-500)]"
          >
            {t(display.i18nKey)}
          </OdsText>
        </span>
      </DataGridTextCell>
    );
  }

  return (
    <DataGridTextCell>
      <OdsBadge
        color={display.color}
        size={ODS_BADGE_SIZE.md}
        label={display.i18nKey ? t(display.i18nKey) : display.rawLabel}
      />
    </DataGridTextCell>
  );
}

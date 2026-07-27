import React from 'react';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { getLicenseTypeDisplay } from '@/utils/licenseLabel/licenseLabel';

interface LicenseTypeCellProps {
  /** Licence effectivement installée. */
  licenseType?: string;
  /** Licence demandée, différente de l'installée pendant un changement. */
  licenseTypeRequested?: string;
  /** Vrai si la ligne a une opération en cours. */
  isInFlight: boolean;
}

/**
 * Colonne « Licence ». Pendant une opération en cours, affiche la transition
 * `licence effective → licence demandée`.
 *
 * La transition n'est affichée *que* si la ligne a une tâche en cours : un changement de
 * licence en échec peut laisser un `licenseTypeRequested` différent sans aucune tâche
 * active, et se fier au seul écart entre les deux champs promettrait indéfiniment un
 * changement qui n'arrivera jamais.
 */
export default function LicenseTypeCell({
  licenseType,
  licenseTypeRequested,
  isInFlight,
}: LicenseTypeCellProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  const toLabel = (value?: string) => {
    const { i18nKey, rawLabel } = getLicenseTypeDisplay(value);
    return i18nKey ? t(i18nKey) : rawLabel;
  };

  const showTransition =
    isInFlight && !!licenseTypeRequested && licenseTypeRequested !== licenseType;

  return (
    <DataGridTextCell>
      {showTransition
        ? `${toLabel(licenseType)} → ${toLabel(licenseTypeRequested)}`
        : toLabel(licenseType)}
    </DataGridTextCell>
  );
}

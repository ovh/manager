import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES, EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

interface VaultUsageCellProps {
  quantityGb?: number;
  /** Renseigné uniquement pour le vault en plan bundle : un vault paygo n'a rien d'inclus. */
  includedStorageGb?: number;
}

export default function VaultUsageCell({ quantityGb, includedStorageGb }: VaultUsageCellProps) {
  // Deux hooks distincts, pas un seul avec un tableau de namespaces : react-i18next ne
  // considère le hook "ready" que si tous ses namespaces sont chargés, et NAMESPACES.BYTES
  // ne l'est pas dans cette appli — ça ferait retomber la traduction BILLING sur sa clé brute.
  const { t: tBytes } = useTranslation(NAMESPACES.BYTES);
  const { t: tBilling } = useTranslation(BACKUP_LICENSES_NAMESPACES.BILLING);

  if (quantityGb === undefined) {
    return <DataGridTextCell>{EMPTY_VALUE_PLACEHOLDER}</DataGridTextCell>;
  }

  const unit = tBytes('unit_size_GB');

  return (
    <DataGridTextCell>
      {includedStorageGb === undefined
        ? `${quantityGb} ${unit}`
        : tBilling('usage.included', { quantity: quantityGb, included: includedStorageGb, unit })}
    </DataGridTextCell>
  );
}

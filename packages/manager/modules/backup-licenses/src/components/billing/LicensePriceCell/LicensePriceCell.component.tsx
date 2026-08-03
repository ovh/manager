import React from 'react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

interface LicensePriceCellProps {
  licensePriceText?: string;
}

/**
 * Colonne « Prix licence ». Pas de badge « Inclus » ici, contrairement à `VaultPriceCell` :
 * aucune règle métier connue ne rend une licence gratuite à prix nul (§7 de la spec BKP-1225).
 */
export default function LicensePriceCell({ licensePriceText }: LicensePriceCellProps) {
  return <DataGridTextCell>{licensePriceText ?? EMPTY_VALUE_PLACEHOLDER}</DataGridTextCell>;
}

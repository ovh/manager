import React from 'react';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { getOsTypeDisplay } from '@/utils/osTypeLabel/osTypeLabel';

interface OsTypeCellProps {
  osType?: string;
}

/** Colonne « OS » : libellé lisible, valeur brute de l'API si l'OS n'est pas connu. */
export default function OsTypeCell({ osType }: OsTypeCellProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);
  const { i18nKey, rawLabel } = getOsTypeDisplay(osType);

  return <DataGridTextCell>{i18nKey ? t(i18nKey) : rawLabel}</DataGridTextCell>;
}

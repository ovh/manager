import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovhcloud/manager-components';
import { ovhLocaleToI18next } from '@ovh-ux/manager-react-shell-client';
import { VeeamBackupWithIam } from '@/data';

export const CreatedAtCell: React.FC<VeeamBackupWithIam> = ({ createdAt }) => {
  const { i18n } = useTranslation('veeam-backup');
  const date = new Date(createdAt);
  return (
    <DataGridTextCell>
      {date.toString() !== 'Invalid Date'
        ? date.toLocaleDateString(ovhLocaleToI18next(i18n.language))
        : '-'}
    </DataGridTextCell>
  );
};

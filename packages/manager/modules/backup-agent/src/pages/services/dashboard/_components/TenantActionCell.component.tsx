import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ArrowLinkCell } from '@/components/CommonCells/ArrowLinkCell/ArrowLinkCell.component';
import { urls } from '@/routes/routes.constants';

export const TenantActionCell: FC<{ id: string }> = () => {
  const href = useHref(urls.dashboardTenant);
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.COMMON);

  return (
    <DataGridTextCell>
      <ArrowLinkCell
        href={href}
        data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}
      />
    </DataGridTextCell>
  );
};

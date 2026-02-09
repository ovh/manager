import { FC } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

import { ArrowLink } from '@/components/ArrowLink/ArrowLink.component';
import { urlParams, urls } from '@/routes/routes.constants';

export const TenantActionCell: FC<{ id: string }> = ({ id }) => {
  const href = useHref(urls.dashboardTenants.replace(urlParams.tenantId, id));
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.COMMON);

  return (
    <DataGridTextCell>
      <ArrowLink href={href} data-arialabel={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:go_to_general_informations`)}/>
    </DataGridTextCell>
  );
};

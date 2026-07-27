import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { routeUrls } from '@/routes/routes.constants';

interface LinkedServersTopbarProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function LinkedServersTopbar({ isLoading, onRefresh }: LinkedServersTopbarProps) {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-between gap-4" data-testid="linked-servers-topbar">
      <OdsButton
        id="add-backup-server"
        data-testid="add-backup-server"
        size={ODS_BUTTON_SIZE.md}
        label={t(`${BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS}:action.add_server`)}
        onClick={() => navigate(routeUrls.order)}
      />
      <OdsButton
        id="refresh-backup-servers"
        data-testid="refresh-backup-servers"
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.md}
        label={t(`${NAMESPACES.ACTIONS}:refresh`)}
        isDisabled={isLoading}
        onClick={onRefresh}
      />
    </div>
  );
}

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsLink, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';
import { LABELS } from '@/module.constants';
import { urls } from '@/routes/routes.constants';

export function GeneralInformationTenantTile() {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD);
  const { data, isPending, isError } = useBackupVSPCTenantDetails();

  const resetPasswordHref = useHref(urls.dashboardTenantResetPassword);

  return (
    <GeneralInformationTile resourceDetails={data} isLoading={isPending}>
      <ManagerTile.Divider />
      <ManagerTile.Item.Label>{LABELS.VSPC}</ManagerTile.Item.Label>
      <ManagerTile.Item>
        {isPending ? (
          <>
            <OdsSkeleton />
            <OdsSkeleton />
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <OdsLink
              isDisabled={isError}
              href={`https://${data?.currentState.accessUrl}`}
              label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:access_to_vspc`)}
              icon="external-link"
              target="_blank"
              rel="noopener noreferrer"
            />
            <OdsLink
              href={resetPasswordHref}
              label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:vspc_reset_password`)}
            />
          </div>
        )}
      </ManagerTile.Item>
    </GeneralInformationTile>
  );
}

export default GeneralInformationTenantTile;

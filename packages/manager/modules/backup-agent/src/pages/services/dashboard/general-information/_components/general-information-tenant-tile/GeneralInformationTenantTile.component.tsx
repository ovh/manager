import { useTranslation } from 'react-i18next';

import { OdsLink, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';

type GeneralInformationTenantTileProps = {
  tenantId: string;
};

export function GeneralInformationTenantTile({ tenantId }: GeneralInformationTenantTileProps) {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD);
  const { data, isPending, isError } = useBackupVSPCTenantDetails({ tenantId });

  return (
    <GeneralInformationTile resourceDetails={data} isLoading={isPending}>
      <ManagerTile.Item>
        {isPending ? (
          <OdsSkeleton />
        ) : (
          <OdsLink
            isDisabled={isError}
            href={`https://${data?.currentState.accessUrl}`}
            label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:access_to_vspc`)}
            icon="external-link"
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
      </ManagerTile.Item>
    </GeneralInformationTile>
  );
}

export default GeneralInformationTenantTile;

import { useHref } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsLink, OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ManagerTile } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { GeneralInformationTile } from '@/components/CommonTiles/GeneralInformationsTile/GeneralInformationTile.component';
import { tenantsQueries } from '@/data/queries/tenants.queries';
import { LABELS } from '@/module.constants';
import { urls } from '@/routes/routes.constants';

export function GeneralInformationTenantTile() {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD);
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery(
    tenantsQueries.withClient(queryClient).vspcDetail(),
  );
  const { trackClick } = useOvhTracking();

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
              onClick={() =>
                trackClick({
                  location: PageLocation.tile,
                  buttonType: ButtonType.externalLink,
                  actionType: 'navigation',
                  actions: ['access-vspc'],
                })
              }
            />
            <OdsLink
              href={resetPasswordHref}
              label={t(`${BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}:vspc_reset_password`)}
              onClick={() =>
                trackClick({
                  location: PageLocation.tile,
                  buttonType: ButtonType.link,
                  actionType: 'navigation',
                  actions: ['reset-password'],
                })
              }
            />
          </div>
        )}
      </ManagerTile.Item>
    </GeneralInformationTile>
  );
}

export default GeneralInformationTenantTile;

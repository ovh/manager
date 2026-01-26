import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid, Links } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useVSPCTenants } from '@/data/hooks/tenants/useVspcTenants';
import { useGuideUtils } from '@/hooks/useGuideUtils';

import { useTenantListingColumns } from './_hooks/useVspcTenantListingColumns';

export default function ListingPage() {
  useTranslation(BACKUP_AGENT_NAMESPACES.SERVICE_LISTING);
  const columns = useTenantListingColumns();
  const { data, isPending } = useVSPCTenants();
  const guide = useGuideUtils();

  return (
    <section className="flex flex-col gap-8">
      <OdsText>
        <Trans
          ns={BACKUP_AGENT_NAMESPACES.SERVICE_LISTING}
          i18nKey="services_tab_description"
          components={{
            Link: (
              <Links
                className="px-2"
                rel="noopener noreferrer"
                target="_blank"
                href={guide?.vspc}
              />
            ),
          }}
        />
      </OdsText>
      <Suspense>
        {columns && (
          <Datagrid
            columns={columns}
            items={data || []}
            totalItems={data?.length || 0}
            isLoading={isPending}
          />
        )}
      </Suspense>
      <Outlet />
    </section>
  );
}

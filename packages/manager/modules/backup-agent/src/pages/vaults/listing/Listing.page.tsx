import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { Datagrid, Links } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupVaultsList } from '@/data/hooks/vaults/getVault';
import { useGuideUtils } from '@/hooks/useGuideUtils';

import { useColumns } from './_hooks/useColumns.hooks';

export default function ListingPage() {
  useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING]);
  const { data } = useBackupVaultsList();
  const columns = useColumns();
  const guide = useGuideUtils();

  return (
    <section className="flex flex-col gap-8">
      <OdsText>
        <Trans
          ns={BACKUP_AGENT_NAMESPACES.VAULT_LISTING}
          i18nKey="vaults_tab_description"
          components={{
            Link: (
              <Links
                className="px-2"
                rel="noopener noreferrer"
                target="_blank"
                href={guide?.vault}
              />
            ),
          }}
        />
      </OdsText>
      <Suspense>
        <Datagrid columns={columns} items={data ?? []} totalItems={data?.length ?? 0} />
        <Outlet />
      </Suspense>
    </section>
  );
}

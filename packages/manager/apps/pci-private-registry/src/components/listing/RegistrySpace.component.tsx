import { useBytes } from '@ovh-ux/manager-pci-common';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetRegistryPlan } from '@/api/hooks/useRegistry';
import { TRegistry } from '@/api/data/registry';

export function RegistrySpace({ registry }: { registry: TRegistry }) {
  const { t } = useTranslation();
  const { formatBytes } = useBytes();

  const { projectId } = useParams();
  const { data, isPending } = useGetRegistryPlan(projectId, registry?.id);

  return (
    <>
      {isPending && <OsdsSkeleton />}
      {!isPending && data && (
        <DataGridTextCell>
          {t('private_registry_consumption_display', {
            used: formatBytes(registry?.size, 2, 1024),
            limit: formatBytes(data.registryLimits?.imageStorage, 2, 1024),
          })}
        </DataGridTextCell>
      )}
    </>
  );
}

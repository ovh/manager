import { DataGridTextCell } from '@ovhcloud/manager-components';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { useParams } from 'react-router-dom';
import { useGetRegistryPlan } from '@/api/hooks/useRegistry';
import { TRegistry } from '@/api/data/registry';

export function RegistryPlan({ registry }: { registry: TRegistry }) {
  const { projectId } = useParams();
  const { data, isPending } = useGetRegistryPlan(projectId, registry?.id);

  return (
    <>
      {isPending && <OsdsSkeleton />}
      {!isPending && data && (
        <DataGridTextCell>{data.name?.charAt(0)}</DataGridTextCell>
      )}
    </>
  );
}

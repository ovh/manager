import { OsdsLink, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useInstance } from '@/api/hooks/useInstance';

interface AttachedInstanceComponentProps {
  projectId: string;
  projectUrl: string;
  instanceId: string;
}

export default function AttachedInstanceComponent({
  projectId,
  instanceId,
  projectUrl,
}: Readonly<AttachedInstanceComponentProps>) {
  const { data: instance, isPending, isLoading } = useInstance(
    projectId,
    instanceId,
  );
  return isPending || isLoading ? (
    <OsdsSkeleton />
  ) : (
    <OsdsLink
      color={ODS_THEME_COLOR_INTENT.primary}
      href={`${projectUrl}/instances/${instanceId}`}
    >
      {instance.name}
    </OsdsLink>
  );
}

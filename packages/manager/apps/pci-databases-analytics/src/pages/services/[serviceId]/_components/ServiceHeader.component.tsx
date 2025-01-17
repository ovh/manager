import { Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import * as database from '@/types/cloud/project/database';
import ServiceStatusBadge from '../../_components/ServiceStatusBadge.component';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { humanizeEngine } from '@/lib/engineNameHelper';
import ServiceNameWithUpdate from './ServiceNameWithUpdate.component';

export const ServiceHeader = ({ service }: { service: database.Service }) => {
  const { t } = useTranslation('regions');
  return (
    <div
      data-testid="service-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
        <Database width={40} height={40} />
      </div>
      <div>
        <ServiceNameWithUpdate service={service} />
        <div className="flex gap-2 flex-wrap">
          <ServiceStatusBadge status={service.status} />
          <OdsBadge
            color={'neutral'}
            label={`${humanizeEngine(service.engine)} ${service.version}`}
          />
          <OdsBadge
            color={'neutral'}
            label={service.plan}
            className="capitalize text-critical-500"
          >
            {service.plan}
          </OdsBadge>
          <OdsBadge
            color={'neutral'}
            label={service.flavor}
            className="capitalize"
          >
            {service.flavor}
          </OdsBadge>
          <OdsBadge
            color={'neutral'}
            label={t(`region_${service.nodes[0].region}`)}
            className="capitalize"
          >
            {}
          </OdsBadge>
        </div>
      </div>
    </div>
  );
};

ServiceHeader.Skeleton = function ServiceHeaderSkeleton() {
  return (
    <div className="flex gap-2 items-center mt-4 mb-6">
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>Dashboard</h2>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
};

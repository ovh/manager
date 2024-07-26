import { Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import ServiceStatusBadge from '../../_components/ServiceStatusBadge.component';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { humanizeEngine } from '@/lib/engineNameHelper';

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
        <h2>{service.description ?? 'Dashboard'}</h2>
        <div className="flex gap-2 flex-wrap">
          <ServiceStatusBadge status={service.status} />
          <Badge variant={'outline'}>
            {humanizeEngine(service.engine)} {service.version}
          </Badge>
          <Badge variant={'outline'} className="capitalize">
            {service.plan}
          </Badge>
          <Badge variant={'outline'} className="capitalize">
            {service.flavor}
          </Badge>
          <Badge variant={'outline'} className="capitalize">
            {t(`region_${service.nodes[0].region}`)}
          </Badge>
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

import { useTranslation } from 'react-i18next';
import { Badge, Skeleton } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import ServiceStatusBadge from '../../_components/ServiceStatusBadge.component';
import { humanizeEngine } from '@/lib/engineNameHelper';
import ServiceNameWithUpdate from './ServiceNameWithUpdate.component';
import { EngineIcon } from '@/components/engine-icon/EngineIcon.component';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';

export const ServiceHeader = ({ service }: { service: database.Service }) => {
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const { t: tRegion } = useTranslation('regions');
  return (
    <div
      data-testid="service-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <EngineIcon
        engine={service.engine}
        category={service.category}
        iconSize={40}
        className="p-2"
      />
      <div>
        <ServiceNameWithUpdate service={service} />
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
            <div className="flex items-center gap-1">
              <Flag
                flagName={getRegionFlag(service.nodes[0].region)}
                className="w-3 h-2"
              />
              {tRegion(`region_${service.nodes[0].region}`)}
            </div>
          </Badge>
          {service?.deletionProtection && (
            <Badge variant={'outline'}>
              {t('deletionProtectionBadgeLabel')}
            </Badge>
          )}
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

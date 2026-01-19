import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud';
import { Archive } from 'lucide-react';
import { Badge, Skeleton } from '@datatr-ux/uxlib';
import Flag from '@/components/flag/Flag.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';
import { RegionTypeBadge } from '@/components/region-type-badge/RegionTypeBadge.component';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

export const S3Header = ({ s3 }: { s3: StorageContainer }) => {
  const localeBytesConverter = useLocaleBytesConverter();
  const { translateMacroRegion } = useTranslatedMicroRegions();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const region = regions?.find((reg) => reg.name === s3.region);
  return (
    <div
      data-testid="s3-header-container"
      className="flex gap-2 items-center mt-4 mb-6 justify-between"
    >
      <div className="flex gap-2 items-center">
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <Archive width={40} height={40} />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{s3.name ?? 'Dashboard'}</h2>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="outline">S3</Badge>
            {region ? (
              <>
                <Badge variant="outline" className="capitalize">
                  <div className="flex items-center gap-1">
                    <Flag flagName={region.countryCode} className="w-3 h-2" />
                    {translateMacroRegion(s3.region)}
                  </div>
                </Badge>
                <RegionTypeBadge type={region.type} />
              </>
            ) : (
              <Skeleton className="h-4 w-10" />
            )}

            {!isLocaleZone && (
              <Badge variant="outline">
                {localeBytesConverter(s3.objectsSize)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <RoadmapChangelog />
    </div>
  );
};

S3Header.Skeleton = function S3HeaderSkeleton() {
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

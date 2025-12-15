import { Archive } from 'lucide-react';
import { Badge, Skeleton } from '@datatr-ux/uxlib';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';
import storages from '@/types/Storages';
import {
  getMacroRegion,
  useTranslatedMicroRegions,
} from '@/hooks/useTranslatedMicroRegions';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';

export const SwiftHeader = ({ swift }: { swift: storages.ContainerDetail }) => {
  const { translateMacroRegion } = useTranslatedMicroRegions();
  const localeBytesConverter = useLocaleBytesConverter();
  return (
    <div
      data-testid="swift-header-container"
      className="flex gap-2 items-center mt-4 mb-6 justify-between"
    >
      <div className="flex gap-2 items-center">
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <Archive width={40} height={40} />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{swift.name ?? 'Dashboard'}</h2>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="outline">Swift</Badge>
            <Badge variant="outline" className="capitalize">
              <div className="flex items-center gap-1">
                <Flag
                  flagName={getRegionFlag(getMacroRegion(swift.region))}
                  className="w-3 h-2"
                />
                {translateMacroRegion(swift.region)}
              </div>
            </Badge>
            <Badge variant="outline">
              {localeBytesConverter(swift.storedBytes)}
            </Badge>
          </div>
        </div>
      </div>
      <RoadmapChangelog />
    </div>
  );
};

SwiftHeader.Skeleton = function S3HeaderSkeleton() {
  return (
    <div className="flex gap-2 items-center mt-4 mb-6">
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2 data-testid="swift-header-skeleton-title">Dashboard</h2>
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

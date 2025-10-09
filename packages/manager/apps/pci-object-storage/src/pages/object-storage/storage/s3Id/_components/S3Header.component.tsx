import {
  RegionTypeEnum,
  StorageContainer,
} from '@datatr-ux/ovhcloud-types/cloud/index';
import { Archive } from 'lucide-react';
import { Badge, Skeleton } from '@datatr-ux/uxlib';
import { getRegionFlag } from '@/lib/flagHelper';
import Flag from '@/components/flag/Flag.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import {
  getMacroRegion,
  useTranslatedMicroRegions,
} from '@/hooks/useTranslatedMicroRegions';

export const S3Header = ({ s3 }: { s3: StorageContainer }) => {
  const { translateMacroRegion } = useTranslatedMicroRegions();
  const { regions } = useObjectStorageData();
  return (
    <div
      data-testid="notebook-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
        <Archive width={40} height={40} />
      </div>
      <div className="w-full">
        <div className="flex flex-row items-center gap-3">
          <h2>{s3.name ?? 'Dashboard'}</h2>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          <Badge variant={'outline'}>S3</Badge>
          <Badge variant={'outline'} className="capitalize">
            <div className="flex items-center gap-1">
              <Flag
                flagName={getRegionFlag(getMacroRegion(s3.region))}
                className="w-3 h-2"
              />
              {translateMacroRegion(s3.region)}
            </div>
          </Badge>
          {regions?.find((reg) => reg.name === s3.region).type ===
          RegionTypeEnum['region-3-az'] ? (
            <Badge className="bg-primary-500">
              <span className="text-white">3-AZ</span>
            </Badge>
          ) : (
            <Badge className="bg-primary-400">
              <span className="text-white">1-AZ</span>
            </Badge>
          )}
        </div>
      </div>
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

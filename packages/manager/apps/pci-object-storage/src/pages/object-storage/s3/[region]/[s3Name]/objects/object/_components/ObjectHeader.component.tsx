import { Badge, Skeleton } from '@datatr-ux/uxlib';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import FileIcon from '@/components/file-icon/FileIcon.component';
import { ObjectDownloadButton } from './ObjectDownloadButton.component';
import { DeepArchiveBadge } from '../../_components/DeepArchiveBadge.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

interface ObjectHeaderProps {
  objectKey: string;
  object: StorageObject;
}

export const ObjectHeader = ({ objectKey, object }: ObjectHeaderProps) => {
  const localeBytesConverter = useLocaleBytesConverter();
  return (
    <div
      data-testid="object-header-container"
      className="flex gap-2 items-center mt-4 mb-6 justify-between"
    >
      <div className="flex gap-2 items-center">
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <FileIcon fileName={objectKey} className="w-10 h-10" />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{objectKey}</h2>
            <ObjectDownloadButton object={object} />
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            <Badge variant="outline">
              {localeBytesConverter(object.size, true, 2)}
            </Badge>
            <DeepArchiveBadge object={object} />
          </div>
        </div>
      </div>
      <RoadmapChangelog />
    </div>
  );
};

ObjectHeader.Skeleton = () => (
    <div className="flex gap-2 items-center mt-4 mb-6">
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>...</h2>
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );


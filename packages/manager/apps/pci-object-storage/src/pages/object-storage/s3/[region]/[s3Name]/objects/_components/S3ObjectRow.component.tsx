import { S3BrowserItem } from '@/data/hooks/s3-storage/useS3ObjectsBrowser.hook';
import { ParentRow } from './ParentRow.component';
import { FolderRow } from './FolderRow.component';
import { FileRow } from './FileRow.component';
import { LZFileRow } from './LZFileRow.component';

interface S3ObjectRowProps {
  item: S3BrowserItem;
  prefix: string;
  onOpenFolder: (prefix: string) => void;
  showVersion?: boolean;
  isLocaleZone?: boolean;
}

const S3ObjectRow = ({
  item,
  prefix,
  onOpenFolder,
  showVersion,
  isLocaleZone,
}: S3ObjectRowProps) => {
  switch (item.type) {
    case 'parent':
      return <ParentRow prefix={prefix} onOpenFolder={onOpenFolder} />;

    case 'folder':
      return <FolderRow item={item} onOpenFolder={onOpenFolder} />;

    case 'file':
      return isLocaleZone ? (
        <LZFileRow object={item} />
      ) : (
        <FileRow item={item} showVersion={showVersion} />
      );

    default:
      return null;
  }
};

export { S3ObjectRow };

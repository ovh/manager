import { File } from 'lucide-react';
import { FILE_TYPE_MAP } from './FileIcon.const';

const FileIcon = ({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) => {
  if (!fileName) return null;

  const ext = fileName.includes('.')
    ? fileName
        .split('.')
        .pop()
        ?.toLowerCase() ?? ''
    : '';
  const Icon = FILE_TYPE_MAP[ext] || File;

  return <Icon className={className} />;
};

export default FileIcon;

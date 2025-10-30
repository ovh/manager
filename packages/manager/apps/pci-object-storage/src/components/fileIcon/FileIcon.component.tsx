import { File } from 'lucide-react';
import clsx from 'clsx';
import { FILE_TYPE_MAP } from './FileIcon.const';

const FileIcon = ({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) => {
  if (!fileName) return null;

  // Extract file extension safely even from full paths
  const cleanName = fileName.split('/').pop() ?? fileName;
  const ext = cleanName.includes('.')
    ? cleanName
        .split('.')
        .pop()
        ?.toLowerCase() ?? ''
    : '';
  const Icon = FILE_TYPE_MAP[ext] || File;

  return <Icon className={clsx('shrink-0', className)} />;
};

export default FileIcon;

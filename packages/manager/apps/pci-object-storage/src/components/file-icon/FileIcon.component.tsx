import { File } from 'lucide-react';
import { FILE_TYPE_MAP } from './FileIcon.const';
import { cn } from '@/lib/utils';

const FileIcon = ({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) => {
  if (!fileName) return null;

  const cleanName = fileName.split('/').pop() ?? fileName;
  const ext = cleanName.includes('.')
    ? cleanName
        .split('.')
        .pop()
        ?.toLowerCase() ?? ''
    : '';
  const Icon = FILE_TYPE_MAP[ext] || File;

  return <Icon className={cn('shrink-0', className)} data-testid="file-icon" />;
};

export default FileIcon;

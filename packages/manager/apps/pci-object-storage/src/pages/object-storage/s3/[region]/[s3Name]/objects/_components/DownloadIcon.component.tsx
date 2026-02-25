import { Download, ArchiveRestore, Loader2 } from 'lucide-react';

interface DownloadIconProps {
  pendingGetPresignUrl: boolean;
  needsRestore: boolean;
}

export const DownloadIcon = ({
  pendingGetPresignUrl,
  needsRestore,
}: DownloadIconProps) => {
  if (pendingGetPresignUrl) {
    return <Loader2 className="size-4 animate-spin" />;
  }
  if (needsRestore) {
    return <ArchiveRestore className="size-4" />;
  }
  return <Download className="size-4" />;
};

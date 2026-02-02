import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@datatr-ux/uxlib';

interface FileUploadPendingProps {
  value?: number; // current uploaded count or percentage
  total?: number; // total count or max percentage (e.g., 100)
}

const FileUploadPending = ({ value, total }: FileUploadPendingProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  // If both value & total are provided and total > 0, we’re in determinate mode
  const isDeterminate =
    typeof value === 'number' && typeof total === 'number' && total > 0;
  const percent = isDeterminate
    ? Math.min((value / total) * 100, 100)
    : undefined;

  return (
    <div
      className="flex flex-col items-center justify-center py-12 space-y-6"
      data-testid="file-upload-pending"
    >
      <Loader2 className="w-8 h-8 text-primary animate-spin" />

      {isDeterminate && (
        <p className="text-sm text-muted-foreground">
          {t('uploadingProgress', {
            defaultValue: '{{value}} of {{total}} files uploaded',
            value,
            total,
          })}
        </p>
      )}

      <div className="w-2/3">
        {isDeterminate ? (
          <Progress value={percent} />
        ) : (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[progress-indeterminate_1.5s_ease-in-out_infinite]" />
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {isDeterminate
          ? t('uploadingFilesInProgress', {
              defaultValue: 'Uploading your files…',
            })
          : t('uploadingFiles', {
              defaultValue: 'Uploading your files, please wait…',
            })}
      </p>
    </div>
  );
};

export default FileUploadPending;

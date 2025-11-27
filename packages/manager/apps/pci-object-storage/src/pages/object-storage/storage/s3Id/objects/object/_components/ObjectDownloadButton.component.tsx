import {
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { useS3ObjectActions } from '../../_hooks/useS3ObjectActions.hook';
import { DownloadIcon } from '../../_components/DownloadIcon.component';

interface ObjectDownloadButtonProps {
  object: StorageObject;
}

export const ObjectDownloadButton = ({ object }: ObjectDownloadButtonProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  const {
    needsRestore,
    isDownloadActionDisabled,
    onDownloadClicked,
    onRestoreClicked,
    pendingGetPresignUrl,
  } = useS3ObjectActions({
    object,
    showVersion: false,
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="h-8"
            mode="default"
            size="sm"
            onClick={needsRestore ? onRestoreClicked : onDownloadClicked}
            disabled={isDownloadActionDisabled}
            aria-label={
              needsRestore ? t('tableActionRestore') : t('tableActionDownload')
            }
          >
            <DownloadIcon
              pendingGetPresignUrl={pendingGetPresignUrl}
              needsRestore={needsRestore}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {needsRestore ? t('tableActionRestore') : t('tableActionDownload')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

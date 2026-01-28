import { useCallback } from 'react';
import { useToast } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';

type DownloadOptions =
  | { type: 'raw'; data: string } // contenu brut
  | { type: 'url'; url: string }; // url distante

function useDownload(): {
  download: (options: DownloadOptions, filename: string) => Promise<void>;
} {
  const toast = useToast();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  const download = useCallback(
    async (options: DownloadOptions, filename: string) => {
      try {
        let blob: Blob;

        if (options.type === 'raw') {
          blob = new Blob([options.data], { type: 'text/plain' });
        } else if (options.type === 'url') {
          const response = await fetch(options.url);
          if (!response.ok) {
            throw new Error(
              t('downloadErrorStatus', { status: response.statusText }),
            );
          }
          blob = await response.blob();
        } else {
          throw new Error(t('downloadErrorUnknownType'));
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        // Nettoyage
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        toast.toast({
          title: t('objectToastErrorTitle'),
          variant: 'critical',
          description:
            error instanceof Error
              ? error.message
              : t('downloadErrorDescription'),
        });
      }
    },
    [toast, t],
  );

  return { download };
}

export default useDownload;

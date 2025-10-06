import { useCallback } from 'react';

type DownloadOptions =
  | { type: 'raw'; data: string } // contenu brut
  | { type: 'url'; url: string }; // url distante

function useDownload(): {
  download: (options: DownloadOptions, filename: string) => Promise<void>;
} {
  const download = useCallback(
    async (options: DownloadOptions, filename: string) => {
      let blob: Blob;

      if (options.type === 'raw') {
        blob = new Blob([options.data], { type: 'text/plain' });
      } else if (options.type === 'url') {
        const response = await fetch(options.url);
        if (!response.ok) {
          throw new Error(
            `Erreur lors du téléchargement : ${response.statusText}`,
          );
        }
        blob = await response.blob();
      } else {
        throw new Error('Type de téléchargement inconnu');
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
    },
    [],
  );

  return { download };
}

export default useDownload;

import { useState, useEffect } from 'react';

/**
 * It generates a CSV file and it's download url.
 * It can run automaticaly the file download.
 *
 * @param dataToExport string[][]
 * @param autoExport boolean
 * @param fileName string
 *
 * @returns string Url to download the file.
 */
export const useExportCsv = ({
  dataToExport,
  autoExport,
  fileName,
}: {
  dataToExport: (string | number)[][];
  autoExport?: boolean;
  fileName?: string;
}) => {
  const [exportCsvUrl, setExportCsvUrl] = useState('');

  useEffect(() => {
    const csvString = dataToExport.map((row) => row.join(';')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    setExportCsvUrl(url);
    // HTMLAnchorElement ??
    let link: HTMLElement | undefined;

    if (autoExport) {
      link = document.createElement('a');

      Object.assign(link, {
        href: url,
        download: fileName || 'download.csv',
      });

      document.body.appendChild(link);
      link.click();
    }

    return () => {
      URL.revokeObjectURL(url);

      if (autoExport && link) {
        document.body.removeChild(link);
      }
    };
  }, []);

  return exportCsvUrl;
};

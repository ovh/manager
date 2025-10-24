import { useState, useEffect } from 'react';

/**
 * It generates a CSV file and it's download url.
 * It can run automaticaly the file download.
 *
 * @param dataToExport string[][]
 * @param autoExport boolean
 * @param fileName string without the file's extension
 *
 * @returns string Url to download the file.
 */
export default ({
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
    const universalBOM = '\uFEFF';
    const blob = new Blob([universalBOM + csvString], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);

    setExportCsvUrl(url);

    let link: HTMLElement;

    if (autoExport) {
      link = document.createElement('a');

      Object.assign(link, {
        href: url,
        download: fileName ? `${fileName}.csv` : 'download.csv',
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

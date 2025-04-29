import { saveAs } from 'file-saver';

/**
 * Initiate a download of a text file with the given filename and text content.
 */
export function initiateTextFileDownload({
  filename,
  text,
}: {
  filename: string;
  text: string;
}) {
  const blob = new Blob([text], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(blob, filename);
}

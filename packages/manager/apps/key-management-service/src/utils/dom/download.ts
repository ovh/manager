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
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

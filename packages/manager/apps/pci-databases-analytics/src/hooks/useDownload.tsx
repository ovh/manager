import { useCallback } from 'react';

function useDownload(): { download: (data: string, filename: string) => void } {
  const download = useCallback((data: string, filename: string) => {
    // Create a Blob from the data
    const blob = new Blob([data], { type: 'text/plain' });
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the object URL
  }, []);

  return { download };
}

export default useDownload;

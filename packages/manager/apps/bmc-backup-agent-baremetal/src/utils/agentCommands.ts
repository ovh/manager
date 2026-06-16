import { WINDOWS_FILENAME_FALLBACK } from '@/utils/tunnel.constants';

/** Extracts the filename from a download URL, falling back to `agent.exe` when unparseable. */
export const getWindowsFilename = (url: string): string => {
  try {
    const name = new URL(url).pathname.split('/').pop();
    return name && name.length > 0 ? name : WINDOWS_FILENAME_FALLBACK;
  } catch {
    return WINDOWS_FILENAME_FALLBACK;
  }
};

export const getWindowsCommand = (url: string): string =>
  `Invoke-WebRequest -Uri "${url}" -OutFile "${getWindowsFilename(url)}"`;

/**
 * Triggers a browser download by creating a transient `<a download>` element,
 * clicking it, then removing it from the DOM (no `window.open`).
 */
export const triggerDownload = (url: string): void => {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = '';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

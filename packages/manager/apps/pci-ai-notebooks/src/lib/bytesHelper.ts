/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function bytesConverter(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  let resultBytes = bytes;
  if (Math.abs(resultBytes) < thresh) {
    return `${resultBytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    resultBytes /= thresh;
    u += 1;
  } while (
    Math.round(Math.abs(resultBytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${resultBytes.toFixed(dp)} ${units[u]}`;
}

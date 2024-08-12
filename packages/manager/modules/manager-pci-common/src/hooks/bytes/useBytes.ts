import { useTranslation } from 'react-i18next';

import '../../translations/bytes';

const UNITS = {
  1000: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  1024: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
};

export function useBytes() {
  const { t } = useTranslation('pci-bytes');
  const formatBytes = (
    bytes: number,
    decimals = 0,
    format: 1000 | 1024 = 1000,
  ) => {
    if (!+bytes) return 0;
    const i = Math.floor(Math.log(bytes) / Math.log(format));
    return `${parseFloat((bytes / format ** i).toFixed(decimals))} ${t(
      `unit_size_${UNITS[format][i]}`,
    )}`;
  };
  return { formatBytes };
}

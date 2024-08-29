import { useTranslation } from 'react-i18next';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export const GB = 10 ** 9;

// @TODO move to pci common or manager-components
export function useBytes() {
  const { t } = useTranslation('bytes');
  const formatBytes = (
    bytes: number,
    decimals = 0,
    format: 1000 | 1024 = 1000,
  ) => {
    if (!+bytes) return `${0} ${t('unit_size_B')}`;
    const i = Math.floor(Math.log(bytes) / Math.log(format));
    return `${parseFloat((bytes / format ** i).toFixed(decimals))} ${UNITS[i]}`;
  };
  return { formatBytes };
}

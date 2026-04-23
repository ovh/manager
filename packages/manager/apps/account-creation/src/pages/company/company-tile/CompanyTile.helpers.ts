import { TFunction } from 'i18next';

export function isNDLabel(label: string) {
  const normalizedLabel = label
    // eslint-disable-next-line no-useless-escape
    .replace(/[\[\]]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

  return normalizedLabel === 'nd' || normalizedLabel === '';
}

export const sanitizedLabel = (label: string, t: TFunction) => {
  if (isNDLabel(label)) {
    return t('fallback_nd_label');
  }
  return label;
};

import { useTranslation } from 'react-i18next';
import { packTypeLabel } from '@/constants';

export const usePackTypeLabel = (packType: string) => {
  const { t } = useTranslation('common');

  return (
    packTypeLabel[packType as keyof typeof packTypeLabel] ??
    t('hycu-cloud-vm-pack-unknown')
  );
};

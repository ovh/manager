import { useTranslation } from 'react-i18next';
import { packTypeLabel } from '@/constants';

export const usePackTypeLabel = (packType: string) => {
  const { t } = useTranslation('common');

  return (
    packTypeLabel[packType as keyof typeof packTypeLabel] ??
    t('hycu_cloud_vm_pack_unknown')
  );
};

import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { getFileStorageGuideItems } from '@/constants/Guides.constants';
import { useGetUser } from '@/hooks/useGetUser';

export const useFileStorageGuideItems = () => {
  const { t } = useTranslation('guides');
  const { ovhSubsidiary } = useGetUser();

  return useMemo(
    () => getFileStorageGuideItems(ovhSubsidiary, t('guides:get-started.alternate-title')),
    [ovhSubsidiary, t],
  );
};

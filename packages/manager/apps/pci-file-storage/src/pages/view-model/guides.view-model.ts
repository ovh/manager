import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import type { Subsidiary } from '@ovh-ux/manager-config';
import type { GuideMenuItem } from '@ovh-ux/muk';

import { getOnboardingLinkFor } from '@/constants/Guides.constants';
import { useGetUser } from '@/hooks/useGetUser';

const getFileStorageGuideItems = (
  subsidiary: Subsidiary,
  gettingStartedLabel: string,
): GuideMenuItem[] => [
  {
    id: 0,
    href: getOnboardingLinkFor('get-started', subsidiary),
    target: '_blank',
    children: gettingStartedLabel,
  },
];

export const useFileStorageGuideItems = () => {
  const { t } = useTranslation('guides');
  const { ovhSubsidiary } = useGetUser();

  return useMemo(
    () => getFileStorageGuideItems(ovhSubsidiary, t('guides:get-started.alternate-title')),
    [ovhSubsidiary, t],
  );
};

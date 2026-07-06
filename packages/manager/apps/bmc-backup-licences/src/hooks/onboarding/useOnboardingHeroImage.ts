import { useTranslation } from 'react-i18next';

import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';

export const useOnboardingHeroImage = () => {
  const { t } = useTranslation(['onboarding']);
  const { productName, heroImage } = useOnboardingContent();

  return heroImage
    ? {
        src: heroImage.src,
        alt: heroImage.alt ?? t('onboarding:hero_alt', { productName }),
        width: 300,
      }
    : undefined;
};

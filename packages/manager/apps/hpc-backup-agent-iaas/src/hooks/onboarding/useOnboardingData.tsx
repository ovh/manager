import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import * as AppC from '@/App.constants';
import type {
  OnboardingConfigType,
  OnboardingContentType,
  OnboardingImage,
  OnboardingLinksType,
} from '@/types/Onboarding.type';

const QUERY_KEY = ['onboarding-config'] as const;

async function getOnboardingConfig(): Promise<OnboardingConfigType> {
  return new Promise((resolve) => {
    resolve(AppC.ONBOARDING_CONFIG);
  });
}

export function useOnboardingContent(): OnboardingContentType {
  const { t } = useTranslation(['onboarding', 'common']);
  const { data } = useQuery<OnboardingConfigType>({
    queryKey: QUERY_KEY,
    queryFn: () => getOnboardingConfig(),
  });

  return useMemo<OnboardingContentType>(() => {
    const productName = data?.productName ?? t('onboarding:productDefaultName', 'Product');

    const heroImage: OnboardingImage | undefined = data?.heroImage?.src
      ? {
          src: data.heroImage.src,
          alt: data.heroImage.alt ?? t('onboarding:heroAlt', { productName }),
        }
      : undefined;

    return {
      productName,
      productCategory: data?.productCategory,
      brand: data?.brand,
      title: data?.title,
      heroImage,
      tiles: Array.isArray(data?.tiles) ? data.tiles : [],
    };
  }, [data, t]);
}

export function useGuideLinks(): OnboardingLinksType {
  const { data } = useQuery<OnboardingConfigType>({
    queryKey: QUERY_KEY,
    queryFn: () => getOnboardingConfig(),
  });

  return useMemo<OnboardingLinksType>(
    () => ({
      discover: data?.links?.discover ?? '',
      tutorial: data?.links?.tutorial ?? '',
      faq: data?.links?.faq ?? '',
    }),
    [data],
  );
}

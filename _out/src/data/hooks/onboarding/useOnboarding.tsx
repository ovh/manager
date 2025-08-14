import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getOnboardingConfig } from '@/data/api/onboarding/Onboarding.api';
import type {
  OnboardingConfigType,
  OnboardingContentType,
  OnboardingImage,
  OnboardingLinksType,
} from '@/types/Onboarding.type';

const QUERY_KEY = ['onboarding-config'] as const;

/**
 * React hook to retrieve and transform onboarding configuration into
 * translated, display-ready content for UI components.
 *
 * This hook fetches onboarding configuration via {@link getOnboardingConfig},
 * applies translations from the `onboarding` and `common` namespaces,
 * and maps the raw API shape into a strongly-typed {@link OnboardingContentType}.
 *
 * @returns An {@link OnboardingContentType} object containing:
 * - `productName`: translated or default product name.
 * - `productCategory`: category string (if provided by API).
 * - `brand`: brand name (if provided by API).
 * - `title`: title string (if provided by API).
 * - `heroImage`: image object with `src` and translated/templated `alt` text.
 * - `tiles`: array of onboarding tile descriptors (empty array if none).
 *
 * @example
 * ```tsx
 * function OnboardingHeader() {
 *   const { productName, heroImage } = useOnboardingContent();
 *   return (
 *     <header>
 *       <h1>Welcome to {productName}</h1>
 *       {heroImage && <img src={heroImage.src} alt={heroImage.alt} />}
 *     </header>
 *   );
 * }
 * ```
 */
export function useOnboardingContent(): OnboardingContentType {
  const { t } = useTranslation(['onboarding', 'common']);
  const { data } = useQuery<OnboardingConfigType>({
    queryKey: QUERY_KEY,
    queryFn: getOnboardingConfig,
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

/**
 * React hook to extract and type onboarding guide links from the onboarding configuration.
 *
 * This hook fetches onboarding configuration via {@link getOnboardingConfig}
 * and maps the `links` property into a fully-typed {@link OnboardingLinksType}
 * with guaranteed string values (empty strings if not provided).
 *
 * @returns An {@link OnboardingLinksType} object containing:
 * - `discover`: link to discovery resources.
 * - `tutorial`: link to tutorial resources.
 * - `faq`: link to FAQ resources.
 *
 * @example
 * ```tsx
 * function OnboardingLinks() {
 *   const { discover, tutorial, faq } = useGuideLinks();
 *   return (
 *     <nav>
 *       <a href={discover}>Discover</a>
 *       <a href={tutorial}>Tutorial</a>
 *       <a href={faq}>FAQ</a>
 *     </nav>
 *   );
 * }
 * ```
 */
export function useGuideLinks(): OnboardingLinksType {
  const { data } = useQuery<OnboardingConfigType>({
    queryKey: QUERY_KEY,
    queryFn: getOnboardingConfig,
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

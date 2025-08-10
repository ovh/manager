/**
 * useOnboardingData.tsx
 * -----------------------------------------------------------------------------
 * Hooks for fetching and transforming onboarding configuration into
 * display-ready UI content and typed guide links.
 */
import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { getOnboardingConfig } from '@/data/api/commons/Client.api';
import type {
  OnboardingConfigType,
  OnboardingContentType,
  OnboardingImage,
  OnboardingLinksType,
} from '@/types/Onboarding.type';

const QUERY_KEY = ['onboarding-config'] as const;

/**
 * Hook: Retrieves onboarding configuration and maps it into a content object
 * enriched with translated fallbacks (title, alt text, etc.).
 *
 * - Uses `react-query` for caching/fetching.
 * - Applies i18n translations when fields are missing.
 * - Provides a UI-ready object for onboarding components.
 *
 * @returns Onboarding content object containing:
 *   - `productName`: Name of the product (fallback: i18n default).
 *   - `productCategory`: Category, if defined.
 *   - `brand`: Brand name, if defined.
 *   - `title`: Onboarding title text.
 *   - `heroImage`: Image object `{ src, alt }`, with translated fallback alt text.
 *   - `tiles`: Array of tile definitions, or empty if undefined.
 *
 * @example
 * ```tsx
 * function OnboardingHero() {
 *   const { productName, heroImage, title } = useOnboardingContent();
 *
 *   return (
 *     <section>
 *       <h1>{title ?? `Welcome to ${productName}`}</h1>
 *       {heroImage && <img src={heroImage.src} alt={heroImage.alt} />}
 *     </section>
 *   );
 * }
 * ```
 */
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

/**
 * Hook: Extracts typed guide links (discover/tutorial/FAQ) from onboarding configuration.
 *
 * - Uses `react-query` for fetching/caching.
 * - Normalizes missing values to empty strings.
 *
 * @returns Onboarding guide links:
 *   - `discover`: Discover page link.
 *   - `tutorial`: Tutorial page link.
 *   - `faq`: FAQ page link.
 *
 * @example
 * ```tsx
 * function OnboardingLinks() {
 *   const { discover, tutorial, faq } = useGuideLinks();
 *
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

/**
 * Onboarding.types.ts
 * -----------------------------------------------------------------------------
 * Shared type definitions for onboarding configuration,
 * tiles, hero images, and guide links.
 */

/**
 * Guide links used in onboarding.
 *
 * @remarks
 * Represents the standard set of guide link categories.
 */
export type OnboardingLinksType = {
  /** Link to product discovery content. */
  discover: string;
  /** Link to tutorial or getting started guide. */
  tutorial: string;
  /** Link to frequently asked questions. */
  faq: string;
};

/**
 * Definition of an onboarding tile.
 *
 * @remarks
 * Tiles are displayed as cards linking to guides or resources.
 */
export type OnboardingTile = {
  /** Numeric identifier of the tile. */
  id: number;
  /** Key used for i18n lookup (e.g. "createProject"). */
  key: string;
  /** Key in {@link OnboardingLinksType} that provides the tile’s link. */
  linkKey: keyof OnboardingLinksType;
};

/**
 * Representation of the onboarding hero image.
 */
export type OnboardingImage = {
  /** Image source URL. */
  src: string;
  /** Optional alt text (falls back to i18n if missing). */
  alt?: string;
};

/**
 * Normalized onboarding content type.
 *
 * @remarks
 * Represents the UI-ready content consumed by onboarding components.
 */
export type OnboardingContentType = {
  /** Display name of the product. */
  productName: string;
  /** Product category label (optional). */
  productCategory?: string;
  /** Brand name (optional). */
  brand?: string;
  /** Page title (optional, may fallback to defaults). */
  title?: string;
  /** Optional hero image (with fallback alt). */
  heroImage?: OnboardingImage;
  /** Array of onboarding tiles. */
  tiles: OnboardingTile[];
};

/**
 * Full onboarding configuration as returned by the API.
 *
 * @remarks
 * Extends {@link OnboardingContentType} with guide links.
 */
export type OnboardingConfigType = OnboardingContentType & {
  /** Set of guide links (discover, tutorial, faq). */
  links: OnboardingLinksType;
};

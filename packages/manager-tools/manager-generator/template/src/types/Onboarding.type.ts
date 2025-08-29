export type OnboardingLinksType = {
  discover: string;
  tutorial: string;
  faq: string;
};

export type OnboardingTile = {
  id: number;
  key: string;
  linkKey: keyof OnboardingLinksType;
};

export type OnboardingImage = {
  src: string;
  alt?: string;
};

export type OnboardingContentType = {
  productName: string;
  productCategory?: string;
  brand?: string;
  title?: string;
  heroImage?: OnboardingImage;
  tiles: OnboardingTile[];
};

export type OnboardingConfigType = OnboardingContentType & {
  links: OnboardingLinksType;
};

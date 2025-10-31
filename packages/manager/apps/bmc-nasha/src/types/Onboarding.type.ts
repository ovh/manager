export interface OnboardingTile {
  id: number;
  key: string;
  linkKey: string;
}

export interface OnboardingLinks {
  discover: string;
  tutorial: string;
  faq: string;
}

export interface OnboardingConfigType {
  productName: string;
  productCategory: string;
  brand: string;
  tiles: OnboardingTile[];
  links: OnboardingLinks;
}

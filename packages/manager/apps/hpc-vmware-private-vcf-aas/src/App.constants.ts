import { OnboardingConfigType } from '@/types/Onboarding.type';

export const appName = 'hpc-vmware-private-vcf-aas';

const docUrl = 'https://docs.ovh.com';

export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'hpc-vmware-private-vcf-aas',
  productCategory: 'Public Cloud',
  brand: 'OVHcloud',
  tiles: [
    { id: 1, key: 'guide1', linkKey: 'discover' },
    { id: 2, key: 'guide2', linkKey: 'tutorial' },
    { id: 3, key: 'guide3', linkKey: 'faq' },
  ],
  links: {
    discover: docUrl,
    tutorial: docUrl,
    faq: docUrl,
  },
};

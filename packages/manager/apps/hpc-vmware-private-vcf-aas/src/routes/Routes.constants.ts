import { appName } from '@/App.constants';

export const subRoutes = {
  root: 'private-vcf-aas',
  onboarding: 'onboarding' as const,
} as const;

export const urls = {
  root: `/${subRoutes.root}`,
  onboarding: `/${subRoutes.root}/${subRoutes.onboarding}`,
} as const;

export const redirectionApp = appName;

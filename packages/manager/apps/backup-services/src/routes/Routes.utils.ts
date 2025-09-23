import { APP_FEATURES, appName } from '@/App.constants';
import { RouteFlavor } from '@/types/Routes.type';

const { basePrefix, appSlug = appName } = APP_FEATURES;

const routeFlavor: RouteFlavor = (APP_FEATURES.routeFlavor ?? 'generic') as RouteFlavor;

export function getRoot(): string {
  const prefix = basePrefix ? `/${String(basePrefix)}` : '';

  if (routeFlavor === 'pci') {
    return `${prefix}/pci/projects/:projectId/${appSlug}`;
  }

  return `${prefix}/${appSlug}`;
}

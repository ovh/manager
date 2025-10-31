import { APP_FEATURES } from '@/App.constants';

const { basePrefix, appSlug } = APP_FEATURES;

export function getRoot(): string {
  const prefix = basePrefix ? `/${String(basePrefix)}` : '';

  // For generic routes in iframe:
  // - If appSlug is empty, React Router should use "/" as root because the container
  //   already handles the app path prefix (/bmc-nasha) and passes only the relative part
  // - The container loads the iframe with hash="#/{relativePath}" where relativePath
  //   is what comes after /bmc-nasha in the container's URL
  if (!appSlug) {
    // Container handles /bmc-nasha, React Router only sees relative paths
    return '/';
  }

  // If appSlug is provided, use it (for custom routing scenarios)
  return `${prefix}/${appSlug}`;
}

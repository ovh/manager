import { useMemo } from 'react';
import { usePciUrl } from '@ovh-ux/manager-pci-common';

/**
 * Hook to replace :projectId placeholder in dashboard links with actual project ID.
 *
 * @param items - Array of items with optional link property
 * @returns Array of items with links containing actual project ID
 */
export const useProjectIdInLinks = <T extends { link?: string }>(
  items: T[],
): T[] => {
  const basePciUrl = usePciUrl(); // Returns '#/pci/projects/{actualId}'

  return useMemo(
    () =>
      items.map((item) => ({
        ...item,
        // Simply replace the placeholder with actual base URL
        link: item.link?.replace('#/pci/projects/:projectId', basePciUrl),
      })),
    [items, basePciUrl],
  );
};

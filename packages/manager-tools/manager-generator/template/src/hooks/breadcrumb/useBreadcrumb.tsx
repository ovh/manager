import { useHref, useLocation } from 'react-router-dom';

import { urls } from '@/routes/Routes.utils';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';
import { formatToTitleCase } from '@/utils/String.utils';

/**
 * Builds a breadcrumb trail from the current URL pathname.
 *
 * Behavior:
 * - Always prepends a **root** crumb using `rootLabel` and the route at `urls.root`.
 * - For each path segment, creates a crumb:
 *   - If a matching `items` entry (by `id`) is found, uses its `{ id, label }`.
 *   - Otherwise, uses the segment as `id` and a title-cased label via {@link formatToTitleCase}.
 * - `href` for each crumb is cumulative (root + joined segments).
 * - Trailing slashes in the root href are trimmed.
 *
 * @param params - Hook parameters.
 * @param params.rootLabel - Label for the root breadcrumb (e.g. app or product name).
 * @param params.items - Optional mapping to override label/id for specific path segments.
 *
 * @returns An array of breadcrumb items, starting with the root item:
 * ```ts
 * Array<{ id: string; label: string; href: string }>
 * ```
 *
 * @example
 * // URL: /app-mock/projects/123/details
 * useBreadcrumb({
 *   rootLabel: 'App Mock',
 *   items: [
 *     { id: 'projects', label: 'Projects' },
 *     { id: 'details', label: 'Details' },
 *   ],
 * });
 * // =>
 * // [
 * //   { id: 'root',     label: 'App Mock', href: '/app-mock' },
 * //   { id: 'projects', label: 'Projects', href: '/app-mock/projects' },
 * //   { id: '123',      label: '123',      href: '/app-mock/projects/123' },
 * //   { id: 'details',  label: 'Details',  href: '/app-mock/projects/123/details' },
 * // ]
 */
export const useBreadcrumb = ({ rootLabel, items = [] }: BreadcrumbProps) => {
  const location = useLocation();
  const rootHref = useHref(urls.root).replace(/\/+$/, ''); // handle multiple trailing slashes

  const rootItem = { id: 'root', label: rootLabel, href: rootHref };

  const pathnames = location.pathname.split('/').filter(Boolean);

  const breadcrumbPathItems = pathnames.map((value, index) => {
    const matchedItem = items.find(({ id }) => id === value);
    return {
      id: matchedItem?.id ?? value,
      label: matchedItem?.label ?? formatToTitleCase(value), // possibly wrap in t()
      href: `${rootHref}/${pathnames.slice(0, index + 1).join('/')}`,
    };
  });

  return [rootItem, ...breadcrumbPathItems];
};

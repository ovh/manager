import { urls } from '@/routes/routes.constants';

const PLATFORM_ROUTE_PREFIX = '/:platformId/';
const PLATFORM_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * First path segments declared under /:platformId (organizations, domains, services, ...).
 * Derived from `urls`, so adding a new section does not require touching this file.
 */
const platformScopedEntryPoints = new Set(
  Object.values(urls)
    .filter((url) => url.startsWith(PLATFORM_ROUTE_PREFIX))
    .map((url) => url.slice(PLATFORM_ROUTE_PREFIX.length).split('/')[0]),
);

/**
 * Tells whether a pathname targets a platform scoped page but misses its :platformId segment,
 * e.g. `/services` instead of `/<platformId>/services`. Such links come from apps that do not
 * know about the platform entity (the services listing, the hub, ...).
 *
 * The router cannot make that distinction on its own, as `:platformId` matches any single
 * segment: `/services` is a valid match with platformId === 'services'. Two conditions are
 * required to remove the ambiguity: the segment cannot be a platform id (those are always
 * UUIDs) and it has to be a known platform scoped entry point. Anything else is left untouched,
 * so an unexpected path can never be silently rewritten.
 */
export const isPlatformLessPathname = (pathname: string): boolean => {
  const [firstSegment] = pathname.split('/').filter(Boolean);

  return (
    !!firstSegment &&
    !PLATFORM_ID_REGEX.test(firstSegment) &&
    platformScopedEntryPoints.has(firstSegment)
  );
};

export const buildURLSearchParams = (searchParams: Record<string, string> = {}): string => {
  const truthyParams = Object.keys(searchParams).reduce(
    (acc, key) => {
      return searchParams[key] ? { ...acc, [key]: searchParams[key] } : acc;
    },
    {} as Record<string, string>,
  );

  if (!Object.keys(truthyParams).length) {
    return '';
  }

  return `?${new URLSearchParams(truthyParams).toString()}`;
};

export const buildURLWithSearchParams = ({
  baseURL,
  searchParams = {},
}: {
  baseURL: string;
  searchParams?: Record<string, string>;
}) => {
  return `${baseURL}${buildURLSearchParams(searchParams)}`;
};

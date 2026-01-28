import { useContext, useEffect, useMemo, useState } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { getRoot } from '@/routes/Routes.base';
import { breadcrumbConfig as defaultBreadcrumbConfig } from '@/routes/breadcrumb/Breadcrumb.config';
import {
  BreadcrumbConfig,
  BreadcrumbItem,
  BreadcrumbItemConfig,
  BreadcrumbRouteConfig,
} from '@/types/breadcrumb/Breadcrumb.types';

export interface UseObsBreadcrumbOptions {
  appName?: string;
  config?: BreadcrumbConfig;
  translationNamespaces?: string[];
}

interface RouteItemContext {
  itemConfig: BreadcrumbItemConfig;
  index: number;
  totalItems: number;
  matchedParams: Record<string, string>;
  appRoot: string;
  t: TFunction;
}

interface ResolveBreadcrumbContext {
  config: BreadcrumbConfig;
  pathname: string;
  routeParams: Record<string, string>;
  rootHref: string;
  t: TFunction;
}

function matchRoutePattern(pathname: string, pattern: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i] ?? '';
    const pathPart = pathParts[i] ?? '';

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

function replacePathParams(path: string, params: Record<string, string>): string {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, value);
  });
  return result;
}

function generatePathBasedItems(pathname: string): BreadcrumbItem[] {
  const pathParts = pathname.split('/').filter(Boolean);

  return pathParts.map((segment, index) => {
    const parentPaths = pathParts.slice(0, index + 1);
    return {
      key: `path-${index}-${segment}`,
      label: segment,
      href: `/${parentPaths.join('/')}`,
      hidden: false,
      isLast: index === pathParts.length - 1,
    };
  });
}

function translateLabel(itemConfig: BreadcrumbItemConfig, t: TFunction): string {
  if (itemConfig.label) {
    return itemConfig.label;
  }
  if (itemConfig.labelKey) {
    const translated = t(itemConfig.labelKey);
    if (translated === itemConfig.labelKey) {
      const parts = itemConfig.labelKey.split(':');
      const lastPart = parts[parts.length - 1] ?? '';
      return lastPart.split('.').pop() ?? translated;
    }
    return translated;
  }
  return '';
}

function translateAriaLabel(itemConfig: BreadcrumbItemConfig, t: TFunction): string | undefined {
  if (!itemConfig.ariaLabel) return undefined;
  const translated = t(itemConfig.ariaLabel);
  return translated !== itemConfig.ariaLabel ? translated : itemConfig.ariaLabel;
}

function findMatchingRoute(
  relativePath: string,
  routes: BreadcrumbRouteConfig[],
  routeParams: Record<string, string>,
): { matchedRoute: BreadcrumbRouteConfig | null; matchedParams: Record<string, string> } {
  for (const route of routes) {
    const params = matchRoutePattern(relativePath, route.pattern);
    if (params !== null) {
      return { matchedRoute: route, matchedParams: { ...routeParams, ...params } };
    }
  }
  return { matchedRoute: null, matchedParams: {} };
}

function resolveSegmentLabel(
  itemConfig: BreadcrumbItemConfig,
  matchedParams: Record<string, string>,
  defaultLabel: string,
): string {
  if (!itemConfig.useSegmentAsLabel) {
    return defaultLabel;
  }

  if (itemConfig.path) {
    const pathParts = itemConfig.path.split('/');
    const lastParam = pathParts.reverse().find((p) => p.startsWith(':'));
    if (lastParam) {
      const paramName = lastParam.slice(1);
      return matchedParams[paramName] || defaultLabel;
    }
  }

  return matchedParams.tenantId || matchedParams.resourceName || defaultLabel;
}

function createRouteItem(ctx: RouteItemContext): BreadcrumbItem {
  const { itemConfig, index, totalItems, matchedParams, appRoot, t } = ctx;
  const baseLabel = translateLabel(itemConfig, t);
  const label = resolveSegmentLabel(itemConfig, matchedParams, baseLabel);

  let href = '';
  if (itemConfig.path) {
    const resolvedPath = replacePathParams(itemConfig.path, matchedParams);
    href = `${appRoot}${resolvedPath}`;
  }

  return {
    key: `route-${index}-${itemConfig.labelKey || label}`,
    label,
    icon: itemConfig.icon,
    href,
    hidden: itemConfig.hidden ?? false,
    ariaLabel: translateAriaLabel(itemConfig, t),
    isLast: index === totalItems - 1,
  };
}

function createRootItem(
  rootConfig: BreadcrumbItemConfig,
  rootHref: string,
  t: TFunction,
): BreadcrumbItem {
  const rootLabel = translateLabel(rootConfig, t);
  return {
    key: 'root',
    label: rootConfig.icon ? undefined : rootLabel,
    icon: rootConfig.icon,
    href: rootHref || getRoot(),
    hidden: rootConfig.hidden ?? false,
    ariaLabel: translateAriaLabel(rootConfig, t),
    isLast: false,
  };
}

function markLastVisibleItem(items: BreadcrumbItem[]): void {
  const visibleItems = items.filter((item) => !item.hidden);
  if (visibleItems.length > 0) {
    items.forEach((item) => {
      item.isLast = false;
    });
    const lastItem = visibleItems[visibleItems.length - 1];
    if (lastItem) {
      lastItem.isLast = true;
    }
  }
}

function resolveBreadcrumbItems(ctx: ResolveBreadcrumbContext): BreadcrumbItem[] {
  const { config, pathname, routeParams, rootHref, t } = ctx;
  const items: BreadcrumbItem[] = [];
  const appRoot = getRoot();
  const relativePath = pathname.startsWith(appRoot)
    ? pathname.slice(appRoot.length) || '/'
    : pathname;

  const { matchedRoute, matchedParams } = findMatchingRoute(
    relativePath,
    config.routes ?? [],
    routeParams,
  );

  if (config.root) {
    items.push(createRootItem(config.root, rootHref, t));
  }

  if (matchedRoute) {
    matchedRoute.items.forEach((itemConfig, index) => {
      items.push(
        createRouteItem({
          itemConfig,
          index,
          totalItems: matchedRoute.items.length,
          matchedParams,
          appRoot,
          t,
        }),
      );
    });
  } else if (config.fallbackToPathBased !== false) {
    generatePathBasedItems(relativePath).forEach((item) => {
      items.push({ ...item, href: `${appRoot}${item.href}` });
    });
  }

  markLastVisibleItem(items);
  return items;
}

function useRootHref(
  appName: string | undefined,
  shell: ShellContextType['shell'] | undefined,
): string {
  const [rootHref, setRootHref] = useState<string>('');

  useEffect(() => {
    const fetchRootUrl = async () => {
      try {
        if (!appName || !shell?.navigation) return;

        const response = await shell.navigation.getURL(appName, '#/', {});

        let href = '';
        if (typeof response === 'string') {
          href = response;
        } else if (response instanceof URL) {
          href = response.href;
        } else if (response && typeof (response as { href?: unknown }).href === 'string') {
          href = (response as { href: string }).href;
        }

        setRootHref(href);
      } catch {
        setRootHref(getRoot());
      }
    };

    void fetchRootUrl();
  }, [appName, shell?.navigation]);

  return rootHref;
}

/**
 * Custom hook for managing breadcrumb state based on route configuration
 */
export function useObsBreadcrumb({
  appName,
  config = defaultBreadcrumbConfig,
  translationNamespaces = ['breadcrumb'],
}: UseObsBreadcrumbOptions = {}): BreadcrumbItem[] {
  const { t } = useTranslation(translationNamespaces);
  const { shell } = useContext(ShellContext);
  const location = useLocation();
  const routeParams = useParams();
  const rootHref = useRootHref(appName, shell);

  return useMemo(
    () =>
      resolveBreadcrumbItems({
        config,
        pathname: location.pathname,
        routeParams: routeParams as Record<string, string>,
        rootHref,
        t,
      }),
    [location.pathname, config, rootHref, t, routeParams],
  );
}

export default useObsBreadcrumb;

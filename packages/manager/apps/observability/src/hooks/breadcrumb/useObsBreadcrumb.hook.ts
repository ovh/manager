import { useContext, useEffect, useMemo, useState } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { UseObsBreadcrumbOptions } from '@/hooks/breadcrumb/useObsBreadcrumb.props';
import { getRoot } from '@/routes/Routes.base';
import { LocationPathParams } from '@/routes/Routes.constants';
import { breadcrumbConfig as defaultBreadcrumbConfig } from '@/routes/breadcrumb/Breadcrumb.config';
import {
  BreadcrumbItem,
  BreadcrumbItemConfig,
  BreadcrumbRouteConfig,
  ResolveBreadcrumbContext,
  RouteItemContext,
} from '@/types/breadcrumb/Breadcrumb.types';

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
  return itemConfig.ariaLabel ? t(itemConfig.ariaLabel) : undefined;
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

function getSegmentLabel(
  itemConfig: BreadcrumbItemConfig,
  matchedParams: Record<string, string>,
): string {
  if (!itemConfig.path) {
    return '';
  }

  const pathParts = itemConfig.path.split('/');
  const lastParam = pathParts.reverse().find((p) => p.startsWith(':'));
  if (lastParam) {
    const paramName = lastParam.slice(1);
    return matchedParams[paramName] || '';
  }

  return '';
}

function createRouteItem(ctx: RouteItemContext): BreadcrumbItem {
  const { itemConfig, index, totalItems, matchedParams, appRoot, t } = ctx;
  const label = translateLabel(itemConfig, t) || getSegmentLabel(itemConfig, matchedParams);

  let to = '';
  if (itemConfig.path) {
    const resolvedPath = replacePathParams(itemConfig.path, matchedParams);
    to = `${appRoot}${resolvedPath}`;
  }

  return {
    key: `route-${index}-${itemConfig.labelKey || label}`,
    label,
    icon: itemConfig.icon,
    to,
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
    href: rootHref,
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

/**
 * Custom hook for managing breadcrumb state based on route configuration
 */
export function useObsBreadcrumb({
  config = defaultBreadcrumbConfig,
  translationNamespaces = ['breadcrumb'],
}: UseObsBreadcrumbOptions = {}): BreadcrumbItem[] {
  const { shell } = useContext(ShellContext);
  const { t } = useTranslation(translationNamespaces);
  const location = useLocation();
  const routeParams = useParams<LocationPathParams>();
  const [rootHref, setRootHref] = useState('');

  useEffect(() => {
    shell.navigation.getURL('hub', '/', {}).then((url) => setRootHref(url as string));
  }, [shell.navigation]);

  return useMemo(
    () =>
      resolveBreadcrumbItems({
        config,
        pathname: location.pathname,
        routeParams,
        rootHref,
        t,
      }),
    [location.pathname, config, t, routeParams, rootHref],
  );
}

export default useObsBreadcrumb;

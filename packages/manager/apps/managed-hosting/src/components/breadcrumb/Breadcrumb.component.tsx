import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useMatches } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BreadcrumbItem as BreadcrumbItemMuk,
  BreadcrumbLink,
  Breadcrumb as BreadcrumbMuk,
  ICON_NAME,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type BreadcrumbHandle = {
  breadcrumb?: {
    label: string;
    icon?: ICON_NAME;
  };
};

type BreadcrumbItem = {
  label: string;
  href: string;
  icon?: ICON_NAME;
};

type BreadcrumbProps = {
  namespace?: string | string[];
  appName?: string;
  hideRootLabel?: boolean;
  rootLabel?: string;
  rootPath?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  namespace = 'common',
  appName,
  hideRootLabel = false,
  rootLabel,
  rootPath = '/hosting',
}) => {
  const { t } = useTranslation(namespace);
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const [rootHref, setRootHref] = useState('#');

  useEffect(() => {
    const fetchRootUrl = async () => {
      try {
        const response = await shell.navigation.getURL('web', rootPath, {});
        setRootHref(response as string);
      } catch (err) {
        console.error('Failed to fetch root URL:', err);
        setRootHref('#');
      }
    };
    void fetchRootUrl();
  }, [shell.navigation, rootPath]);

  const routeItems = useMemo<BreadcrumbItem[]>(() => {
    return matches.reduce<BreadcrumbItem[]>((acc, match) => {
      const handle = match.handle as BreadcrumbHandle;
      if (handle?.breadcrumb) {
        const { label, icon } = handle.breadcrumb;
        const resolvedLabel = label.startsWith(':') ? match.params[label.slice(1)] : t(label);
        acc.push({
          label: resolvedLabel,
          href: `#${match.pathname}`,
          icon,
        });
      }
      return acc;
    }, []);
  }, [matches, t]);

  const itemsWithWordPress = useMemo(() => {
    const items = [...routeItems];
    if (
      window.location.hash.match(/^#\/?managed-hosting-for-wordpress\/[^/]+/) &&
      !items.some((c) => c.label === t('managed_wordpress'))
    ) {
      items.unshift({
        label: t('managed_wordpress'),
        href: '#/managed-hosting-for-wordpress',
      });
    }
    return items;
  }, [routeItems, t]);

  const breadcrumbItems = useMemo(() => {
    if (appName && !hideRootLabel) {
      return [
        {
          label: rootLabel || appName,
          href: rootHref,
        },
        ...itemsWithWordPress,
      ];
    }
    return itemsWithWordPress;
  }, [appName, hideRootLabel, rootLabel, rootHref, itemsWithWordPress]);

  return (
    <BreadcrumbMuk data-testid="breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <BreadcrumbItemMuk key={`${item.label}-${index}`}>
          <BreadcrumbLink href={item.href}>
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </BreadcrumbLink>
        </BreadcrumbItemMuk>
      ))}
    </BreadcrumbMuk>
  );
};

export default Breadcrumb;

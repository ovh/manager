import React, { useContext, useEffect, useMemo } from 'react';

import { useMatches } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BreadcrumbItem as BreadcrumbItemMuk,
  BreadcrumbLink,
  Breadcrumb as BreadcrumbMuk,
  ICON_NAME,
} from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  label?: string;
  icon?: ICON_NAME;
  href: string;
};

export const Breadcrumb: React.FC<{ namespace?: string | string[] }> = ({
  namespace = 'common',
}) => {
  const { t } = useTranslation(namespace);
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const [, setHref] = React.useState('#');

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL('web', '/hosting', {});
        setHref(response as string);
      } catch {
        setHref('#');
      }
    };
    void fetchUrl();
  }, [shell.navigation]);

  const items = useMemo(() => {
    let crumbs = matches.reduce((acc, match) => {
      const handle = match.handle as Record<string, string>;
      if (handle?.breadcrumb) {
        const breadcrumb = handle.breadcrumb as unknown as Record<string, string>;
        const label = breadcrumb?.label?.startsWith(':')
          ? match.params[breadcrumb?.label?.slice(1)]
          : t(breadcrumb?.label);
        acc.push({
          href: `#${match.pathname}`,
          ...breadcrumb,
          label,
        });
      }
      return acc;
    }, [] as BreadcrumbItem[]);

    if (
      window.location.hash.match(/^#\/?managed-hosting-for-wordpress\/[^/]+/) &&
      !crumbs.some((c) => c.label === t('managed_wordpress'))
    ) {
      crumbs = [
        {
          label: t('managed_wordpress'),
          href: '#/managed-hosting-for-wordpress',
        },
        ...crumbs,
      ];
    }

    return crumbs;
  }, [matches, t]);

  return (
    <BreadcrumbMuk data-testid="breadcrumb">
      {items.map((item, index) => (
        <BreadcrumbItemMuk key={`${item.label}-${index}`}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
        </BreadcrumbItemMuk>
      ))}
    </BreadcrumbMuk>
  );
};

export default Breadcrumb;

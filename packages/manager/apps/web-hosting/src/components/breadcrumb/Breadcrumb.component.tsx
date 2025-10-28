import React, { useContext, useEffect, useMemo } from 'react';

import { useMatches } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  label?: string;
  icon?: ODS_ICON_NAME;
  href: string;
};

export const Breadcrumb: React.FC<{ namespace?: string | string[] }> = (
  { namespace } = { namespace: 'common' },
) => {
  const { t } = useTranslation(namespace);
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const [href, setHref] = React.useState('#');

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

  const rootItem = {
    label: t('hosting'),
    href,
  };

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
    <OdsBreadcrumb data-testid="breadcrumb">
      {[rootItem, ...items].map((item, index) => (
        <OdsBreadcrumbItem
          {...item}
          color={ODS_LINK_COLOR.primary}
          target="_self"
          key={`${item.label}-${index}`}
        />
      ))}
    </OdsBreadcrumb>
  );
};

export default Breadcrumb;

import React, { useMemo } from 'react';
import { useMatches } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constants';

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

  const rootItem = {
    label: t('hosting'),
    href: urls.hosting,
  };

  const items = useMemo(
    () =>
      matches.reduce((crumbs, match) => {
        const handle = match.handle as Record<string, string>;
        if (handle?.breadcrumb) {
          const breadcrumb = (handle.breadcrumb as unknown) as Record<
            string,
            string
          >;
          const label = breadcrumb?.label?.startsWith(':')
            ? match.params[breadcrumb?.label?.slice(1)]
            : t(breadcrumb?.label);
          crumbs.push({
            href: `#${match.pathname}`,
            ...breadcrumb,
            label,
          });
        }

        return crumbs;
      }, [] as BreadcrumbItem[]),
    [matches],
  );

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

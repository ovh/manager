import React, { useMemo } from 'react';

import { useLocation, useMatches, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useAccount, useDomain, useOrganization } from '@/data/hooks';
import { RouteMatch } from '@/routes/routes';
import { buildURLSearchParams } from '@/utils';

export type BreadcrumbItem = {
  label?: string;
  icon?: ODS_ICON_NAME;
  href: string;
};

export const Breadcrumb: React.FC<{ namespace?: string | string[] }> = (
  { namespace } = { namespace: 'common' },
) => {
  const { t } = useTranslation(namespace);
  const [searchParams] = useSearchParams();
  const matches = useMatches() as RouteMatch[];
  const location = useLocation();

  const organizationId = searchParams.get('organizationId');
  const search = buildURLSearchParams({
    organizationId,
  });

  const { data: organization } = useOrganization();
  const { data: account } = useAccount();
  const { data: domain } = useDomain();

  const items = useMemo(() => {
    const crumbItems = matches.reduce((crumbs, match, index) => {
      const { handle, pathname } = match;
      let href = `#${pathname}${index === 0 ? '' : search}`;

      if (handle?.breadcrumb) {
        const { breadcrumb } = handle;
        let label = t(breadcrumb.label);

        if (breadcrumb?.label?.startsWith(':')) {
          const reference = breadcrumb?.label?.slice(1);
          switch (true) {
            case reference === 'organizationId' && !!organization:
              label = organization.currentState?.name;
              href = null;
              break;
            case reference === 'accountId' && !!account:
              label = account.currentState?.email;
              break;
            case reference === 'domainId' && !!domain:
              label = domain.currentState?.name;
              href = null;
              break;
            default:
              label = match.params[breadcrumb?.label?.slice(1)];
              href = null;
              break;
          }
        }

        crumbs.push({
          ...breadcrumb,
          label,
          href,
        });
      }

      return crumbs;
    }, [] as BreadcrumbItem[]);

    if (organization && organizationId && matches[1]?.pathname) {
      crumbItems.splice(1, 0, {
        label: organization.currentState.name,
        href: `#${matches[1]?.pathname}${search}`,
      });
    }

    return crumbItems;
  }, [location, matches, organization, account, domain]);

  return (
    <OdsBreadcrumb key={items.length} data-testid="breadcrumb">
      {items.map((item, index) => (
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

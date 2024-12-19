import React, { useMemo } from 'react';
import {
  useSearchParams,
  createSearchParams,
  useLocation,
  useMatches,
} from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { useOrganization } from '@/hooks';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

const whiteListedSearchParams = ['organizationId'];

export const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const { t } = useTranslation('dashboard');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const matches = useMatches();

  const queryParams = useMemo(() => {
    return Array.from(searchParams.entries()).filter(([key]) =>
      whiteListedSearchParams.includes(key),
    );
  }, [searchParams]);

  const search = useMemo(
    () => (queryParams.length ? `?${createSearchParams(queryParams)}` : ''),
    [queryParams],
  );
  const { data: organization, isLoading } = useOrganization();

  const breadcrumbItems = useMemo(() => {
    const items = matches.slice(1);
    const parts = items.map((item, index) => ({
      label: t(
        (item.handle as Record<string, string>)?.breadcrumbLabel ||
          'to_be_defined',
      ),
      href: `#${item.pathname}${index === 0 ? '' : search}`,
    }));

    if (organization && !isLoading) {
      parts.splice(1, 0, {
        label: organization.currentState.name,
        href: `#${items[0].pathname}${search}`,
      });
    }

    return parts;
  }, [location, organization]);

  return (
    <OdsBreadcrumb data-testid="breadcrumb">
      {breadcrumbItems.map((item) => (
        <OdsBreadcrumbItem
          key={item.label}
          href={item.href}
          color={ODS_LINK_COLOR.primary}
          label={item.label}
          target="_self"
        />
      ))}
    </OdsBreadcrumb>
  );
};

export default Breadcrumb;

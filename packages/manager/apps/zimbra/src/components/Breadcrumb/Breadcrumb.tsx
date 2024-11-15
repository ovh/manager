import React, { useMemo } from 'react';
import {
  useParams,
  useSearchParams,
  createSearchParams,
  useLocation,
} from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { urls } from '@/routes/routes.constants';
import { useGenerateUrl, useOrganization } from '@/hooks';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

const whiteListedSearchParams = ['organizationId'];

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  overviewUrl,
}) => {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useMemo(() => {
    return Array.from(searchParams.entries()).filter(([key]) =>
      whiteListedSearchParams.includes(key),
    );
  }, [searchParams]);
  const search = useMemo(
    () => (params.length ? `?${createSearchParams(params)}` : ''),
    [params],
  );
  const { data: organization, isLoading } = useOrganization();

  const rootUrl = serviceName
    ? '#/:serviceName'.replace(':serviceName', serviceName)
    : '#/';

  const overviewUrlValue = useGenerateUrl(
    overviewUrl ||
      (serviceName ? urls.overview.replace(':serviceName', serviceName) : '/'),
    'href',
  );

  const breadcrumbItems = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbParts = pathParts.slice(1);

    return [
      {
        label: t('zimbra_dashboard_title'),
        href: rootUrl,
      },
      ...(organization && !isLoading
        ? [
            {
              label: organization?.currentState.name,
              href: overviewUrlValue,
            },
          ]
        : []),
      ...breadcrumbParts.map((_, index) => {
        const url = `#/${pathParts.slice(0, index + 2).join('/')}${search}`;
        const label = t(
          `zimbra_dashboard_${breadcrumbParts.slice(0, index + 1).join('_')}`,
        );
        return {
          label,
          href: url,
        };
      }),
      ...items,
    ].filter(Boolean);
  }, [location, organization]);

  return (
    <OdsBreadcrumb data-testid="breadcrumb" className="mb-4">
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

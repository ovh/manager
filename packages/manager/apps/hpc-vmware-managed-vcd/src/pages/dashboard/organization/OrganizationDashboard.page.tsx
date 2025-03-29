import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import VcdDashboardLayout from '@/components/dashboard/layout/VcdDashboardLayout.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { subRoutes, urls } from '@/routes/routes.constant';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';

export default function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdOrganisation } = useVcdOrganization({ id });
  const navigate = useNavigate();

  const tabsList = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'datacentres',
      title: VIRTUAL_DATACENTERS_LABEL,
      to: useResolvedPath(subRoutes.virtualDatacenters).pathname,
    },
  ];

  const serviceName = vcdOrganisation?.data?.currentState?.fullName;
  const hasServiceRenamed = id !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: id,
        title: serviceName,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }
    : {
        title: id,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: serviceName,
    },
    {
      id: subRoutes.virtualDatacenters,
      label: VIRTUAL_DATACENTERS_LABEL,
    },
  ];

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      breadcrumbItems={breadcrumbItems}
      header={header}
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() => navigate(urls.listing)}
    />
  );
}

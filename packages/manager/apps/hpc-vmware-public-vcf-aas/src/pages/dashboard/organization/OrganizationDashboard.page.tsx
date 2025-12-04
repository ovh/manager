import { useNavigate, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import { ChangelogButton, HeadersProps } from '@ovh-ux/manager-react-components';

import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';
import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';
import { AsyncFallback } from '@/components/query/AsyncFallback.component';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOrganisationParams } from '@/hooks/params/useSafeParams';
import { subRoutes, urls } from '@/routes/routes.constant';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';

export default function DashboardPage() {
  const { id } = useOrganisationParams();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { data: vcdOrganisation, isLoading, error } = useVcdOrganization({ id });
  const navigate = useNavigate();

  const tabsList: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.dashboard,
    },
    {
      name: 'datacentres',
      title: VIRTUAL_DATACENTERS_LABEL,
      to: useResolvedPath(subRoutes.virtualDatacenters).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.datacentres,
    },
  ];

  if (isLoading) return <AsyncFallback state="loading" />;
  if (error) return <AsyncFallback state="error" error={error} />;
  if (!vcdOrganisation?.data) return <AsyncFallback state="emptyError" />;

  const serviceName = vcdOrganisation.data.currentState.fullName;
  const hasServiceRenamed = id !== serviceName;

  const header: HeadersProps = hasServiceRenamed
    ? {
        description: id,
        title: serviceName,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        headerButton: <VcdGuidesHeader />,
      }
    : {
        title: id,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        headerButton: <VcdGuidesHeader />,
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
    {
      id: subRoutes.terminate,
      label: t(`${NAMESPACES.ACTIONS}:terminate`),
    },
  ];

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      breadcrumbItems={breadcrumbItems}
      header={header}
      message={<MessageSuspendedService status={vcdOrganisation.data.resourceStatus} />}
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() => navigate(urls.listing)}
    />
  );
}

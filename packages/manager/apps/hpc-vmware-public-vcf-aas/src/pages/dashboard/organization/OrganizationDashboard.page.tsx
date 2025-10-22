import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ChangelogButton,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';

import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { subRoutes, urls } from '@/routes/routes.constant';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';
import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';

export default function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { data: vcdOrganisation } = useVcdOrganization({ id });
  const navigate = useNavigate();

  const tabsList: DashboardTab[] = [
    {
      name: 'general_information',
      title: tDashboard('general_information'),
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

  const serviceName = vcdOrganisation?.data?.currentState?.fullName;
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
      message={
        <MessageSuspendedService
          status={vcdOrganisation?.data?.resourceStatus}
        />
      }
      backLinkLabel={tActions('back_to_list')}
      onClickReturn={() => navigate(urls.listing)}
    />
  );
}

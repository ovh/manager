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

import { subRoutes, urls } from '@/routes/routes.constant';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';
import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';

export default function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation('dashboard');
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
    {
      name: 'networkAcl',
      title: t('managed_vcd_dashboard_general_network_acl'),
      to: useResolvedPath(subRoutes.networkAcl).pathname,
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

  return (
    <VcdDashboardLayout
      tabs={tabsList}
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

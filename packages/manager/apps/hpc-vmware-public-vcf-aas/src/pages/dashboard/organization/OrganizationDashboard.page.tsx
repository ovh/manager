import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import { ChangelogButton, HeadersProps } from '@ovh-ux/manager-react-components';

import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';
import VcdGuidesHeader from '@/components/guide/VcdGuidesHeader';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';

import { VIRTUAL_DATACENTERS_LABEL } from './organizationDashboard.constants';

export default function DashboardPage() {
  const { id } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdOrganisation } = useVcdOrganization({ id });
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
      message={<MessageSuspendedService status={vcdOrganisation?.data?.resourceStatus} />}
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() => navigate(urls.listing)}
    />
  );
}

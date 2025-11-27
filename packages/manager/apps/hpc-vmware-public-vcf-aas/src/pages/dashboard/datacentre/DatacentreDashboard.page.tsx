import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useVcdDatacentre,
  getVcdDatacentreListQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';
import { COMPUTE_LABEL, STORAGE_LABEL } from './datacentreDashboard.constants';
import { subRoutes, urls } from '@/routes/routes.constant';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { isUpdatingTargetSpec } from '@/utils/refetchConditions';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import { VRACK_LABEL } from '../dashboard.constants';
import { FEATURE_FLAGS } from '@/app.constants';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';

function DatacentreDashboardPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation('dashboard');
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const { data: featuresAvailable } = useFeatureAvailability([
    FEATURE_FLAGS.VRACK,
  ]);
  const isVrackFeatureAvailable = featuresAvailable?.[FEATURE_FLAGS.VRACK];
  const navigate = useNavigate();

  useAutoRefetch({
    queryKey: getVcdDatacentreListQueryKey(id),
    enabled: isUpdatingTargetSpec(vcdDatacentre?.data),
    interval: 4000,
  });

  const tabsList: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.datacentres,
    },
    {
      name: 'compute',
      title: COMPUTE_LABEL,
      to: useResolvedPath(subRoutes.datacentreCompute).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.compute,
    },
    {
      name: 'storage',
      title: STORAGE_LABEL,
      to: useResolvedPath(subRoutes.datacentreStorage).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.storage,
    },
    {
      name: 'vrack-segments',
      title: VRACK_LABEL,
      to: useResolvedPath(subRoutes.vrackSegments).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.vrack,
      disabled:
        !isVrackFeatureAvailable || !vcdDatacentre?.data?.currentState?.vrack,
    },
  ].filter(({ disabled }) => !disabled);

  const serviceName = vcdDatacentre?.data?.currentState?.description ?? vdcId;
  const hasServiceRenamed = vdcId !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: vdcId,
        title: serviceName,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }
    : {
        title: vdcId,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      };

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      header={header}
      message={
        <MessageSuspendedService status={vcdDatacentre?.data?.resourceStatus} />
      }
      backLinkLabel={t('managed_vcd_dashboard_back_link')}
      onClickReturn={() =>
        navigate(urls.datacentres.replace(subRoutes.dashboard, id))
      }
    />
  );
}

export default DatacentreDashboardPage;

import { OdsDivider } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { ODS_DIVIDER_SPACING } from '@ovhcloud/ods-components';
import DashboardTiles from './components/DashboardTiles.component';
import DiscoveryBanner from './components/DiscoveryBanner.component';
import Others from './components/Others.component';
import QuickAccess from './components/QuickAccess.component';
import ActivateProjectModal from './components/activate-project-modal/ActivateProject';

export default function Home() {
  const { data: project } = useProject();
  const isDiscovery = project ? isDiscoveryProject(project) : false;

  return (
    <>
      {isDiscovery && <DiscoveryBanner className="mb-6 w-full" />}
      <QuickAccess />
      <Others />
      <OdsDivider spacing={ODS_DIVIDER_SPACING._48} />
      <DashboardTiles />
      <ActivateProjectModal />
    </>
  );
}

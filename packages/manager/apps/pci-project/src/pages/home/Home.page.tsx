import { OdsDivider } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';
import { ODS_DIVIDER_SPACING } from '@ovhcloud/ods-components';
import ActivateProjectModal from '@/pages/home/components/activate-project-modal/ActivateProject';
import BillingTile from '@/pages/home/components/BillingTile.component';
import CommunityTile from '@/pages/home/components/CommunityTile.component';
import DiscoveryBanner from '@/pages/home/components/DiscoveryBanner.component';
import DocumentationTile from '@/pages/home/components/DocumentationTile.component';
import Others from '@/pages/home/components/Others.component';
import QuickAccess from '@/pages/home/components/QuickAccess.component';

export default function Home() {
  const { data: project } = useProject();
  const isDiscovery = project ? isDiscoveryProject(project) : false;

  return (
    <>
      {isDiscovery && <DiscoveryBanner className="mb-6 w-full" />}
      <QuickAccess />
      <Others />
      <OdsDivider spacing={ODS_DIVIDER_SPACING._48} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-start">
        <BillingTile />
        <DocumentationTile />
        <CommunityTile />
      </div>
      <ActivateProjectModal />
    </>
  );
}

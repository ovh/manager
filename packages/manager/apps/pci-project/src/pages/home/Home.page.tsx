import { OdsDivider } from '@ovhcloud/ods-components/react';

import QuickAccess from './components/QuickAccess.component';
import Others from './components/Others.component';
import DiscoveryBanner from './components/DiscoveryBanner.component';
import DashboardTiles from './components/DashboardTiles.component';

export default function Home() {
  return (
    <>
      <DiscoveryBanner className="mb-6 w-full" />
      <QuickAccess />
      <Others />
      <OdsDivider className="my-8 block" />
      <DashboardTiles />
    </>
  );
}

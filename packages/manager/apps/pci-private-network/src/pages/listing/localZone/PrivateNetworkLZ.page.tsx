import { OsdsTabPanel } from '@ovhcloud/ods-components/react';
import { PrivateNetworkTabName } from '../ListingLayout.constant';
import { useActiveTab } from '@/hooks/useActiveTab/useActiveTab';

const PrivateNetworkLZ: React.FC = () => {
  const activeTab = useActiveTab();

  return (
    <OsdsTabPanel
      active={activeTab === PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
      name={PrivateNetworkTabName.LOCAL_ZONE_TAB_NAME}
    >
      <div>tsiori</div>
    </OsdsTabPanel>
  );
};

export default PrivateNetworkLZ;

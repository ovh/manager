import { CookiesProvider } from 'react-cookie';
import { Subsidiary, Region } from '@ovh-ux/manager-config';
import { TrackingPlugin } from '@ovh-ux/shell';
import { DataUsagePolicyModal } from './modal/DataUsagePolicyModal.component';

type Props = {
  subsidiary: Subsidiary;
  region: Region;
  trackingPlugin: TrackingPlugin;
};

export const DataUsagePolicy = ({
  subsidiary,
  region,
  trackingPlugin,
}: Props) => (
  <CookiesProvider>
    <DataUsagePolicyModal
      subsidiary={subsidiary}
      region={region}
      trackingPlugin={trackingPlugin}
    />
  </CookiesProvider>
);

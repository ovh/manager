import React from 'react';

import EdgeNetworkFirewallPage from './components/EdgeNetworkFirewallPage.component';
import { EdgeFirewallContextProvider } from './edgeNetworkFirewall.context';

export default function ConfigureGameFirewall() {
  return (
    <EdgeFirewallContextProvider>
      <EdgeNetworkFirewallPage />
    </EdgeFirewallContextProvider>
  );
}

import React from 'react';
import { EdgeFirewallContextProvider } from './edgeNetworkFirewall.context';
import EdgeNetworkFirewallPage from './components/EdgeNetworkFirewallPage.component';

export default function ConfigureGameFirewall() {
  return (
    <EdgeFirewallContextProvider>
      <EdgeNetworkFirewallPage />
    </EdgeFirewallContextProvider>
  );
}

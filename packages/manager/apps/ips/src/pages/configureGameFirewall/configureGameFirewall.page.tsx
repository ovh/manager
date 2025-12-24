import React from 'react';

import GameFirewallPage from './components/GamefirewallPage.component';
import { GameFirewallContextProvider } from './gamefirewall.context';

export default function ConfigureGameFirewall() {
  return (
    <GameFirewallContextProvider>
      <GameFirewallPage />
    </GameFirewallContextProvider>
  );
}

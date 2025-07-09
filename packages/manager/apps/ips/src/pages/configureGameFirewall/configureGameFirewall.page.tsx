import React from 'react';
import { GameFirewallContextProvider } from './gamefirewall.context';
import GameFirewallPage from './components/GamefirewallPage.component';

export default function ConfigureGameFirewall() {
  return (
    <GameFirewallContextProvider>
      <GameFirewallPage />
    </GameFirewallContextProvider>
  );
}

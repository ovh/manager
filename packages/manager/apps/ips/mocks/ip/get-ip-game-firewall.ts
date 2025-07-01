import {
  IpGameFirewallStateEnum,
  IpGameFirewallType,
} from '../../src/data/api';

export const getIpGameFirewallResponse = ({
  state = IpGameFirewallStateEnum.OK,
  ipOnGame,
  firewallModeEnabled = false,
}: Partial<IpGameFirewallType>): IpGameFirewallType[] => [
  {
    state,
    ipOnGame,
    maxRules: 30,
    supportedProtocols: [
      'arkSurvivalEvolved',
      'arma',
      'gtaMultiTheftAutoSanAndreas',
      'gtaSanAndreasMultiplayerMod',
      'hl2Source',
      'minecraftJava',
      'minecraftPocketEdition',
      'minecraftQuery',
      'mumble',
      'other',
      'rust',
      'teamspeak2',
      'teamspeak3',
      'trackmaniaShootmania',
    ],
    firewallModeEnabled,
  },
];

export const getGameFirewallRuleListResponse = [123456, 123457, 123458];

export const getGameFirewallRuleResponse = (id: number) => ({
  id,
  state: 'ok',
  ports: { from: 27015, to: 27015 },
  protocol: 'hl2Source',
});

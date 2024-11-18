import { IpGameFirewallRule } from '@/data/api';

export const IP_MITIGATION_RULE_PROTOCOL_PORT: {
  [protocol: string]: { from?: number; to?: number };
} = {
  arkSurvivalEvolved: { from: 7777, to: 7778 },
  arma: { from: 2302 },
  gtaMultiTheftAutoSanAndreas: { from: 22003 },
  gtaSanAndreasMultiplayerMod: { from: 7777 },
  hl2Source: { from: 27015 },
  minecraftPocketEdition: { from: 19132, to: 19133 },
  minecraftQuery: { from: 25565 },
  rust: { from: 28015 },
  trackmaniaShootmania: { from: 2350, to: 2450 },
};

export const PORT_MIN = 1;
export const PORT_MAX = 65535;

export const hasPortRangeError = ({
  startPort,
  endPort,
}: {
  startPort: number;
  endPort: number;
}) =>
  startPort < PORT_MIN ||
  startPort > PORT_MAX ||
  endPort > PORT_MAX ||
  endPort < PORT_MIN;

export const hasConflictingPorts = ({
  startPort,
  endPort,
  rules,
}: {
  startPort: number;
  endPort: number;
  rules: IpGameFirewallRule[];
}) =>
  rules.some(
    (rule) =>
      (startPort >= rule.ports.from && startPort <= rule.ports.to) ||
      (endPort >= rule.ports.from && endPort <= rule.ports.to),
  );

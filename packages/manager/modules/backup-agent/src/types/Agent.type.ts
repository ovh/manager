export type AgentType = 'BAREMETAL' | 'ON-PREMISE' | 'PCI' | 'VPS';

export type Agent = {
  id: string; // uuid
  ips: string[]; // array of ipv4 addresses
  name: string;
  productResourceName: string;
  policy: string; // vspc backup policy configured for agent
  type: AgentType; // Backup Agent target Product type
  vaultId?: string;
};

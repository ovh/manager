const US_BACKUP_AGENT_DATACENTER_PREFIXES = ['vin', 'hil'];

export const isUsBaremetal = (datacenter: string): boolean =>
  US_BACKUP_AGENT_DATACENTER_PREFIXES.some((prefix) => datacenter.toLowerCase().startsWith(prefix));

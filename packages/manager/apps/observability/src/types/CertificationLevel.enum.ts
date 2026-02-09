export const CertificationLevel = {
  HDS: 'HDS' as const,
  PCI_DSS: 'PCI_DSS' as const,
  SNC: 'SNC' as const,
  SOC2: 'SOC2' as const,
  STANDARD: 'STANDARD' as const,
  TRUSTED_ZONE: 'TRUSTED_ZONE' as const,
} as const;

export type CertificationLevel = (typeof CertificationLevel)[keyof typeof CertificationLevel];

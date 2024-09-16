export const DNS_CONFIG_TYPE = {
  STANDARD: 'standard',
  EXPERT: 'expert',
};

export enum DnsRecordType {
  SRV = 'SRV',
  MX = 'MX',
  SPF = 'SPF',
  DKIM = 'DKIM',
}

export enum DnsRecordTypeKey {
  SRV = 'srv',
  MX = 'mx',
  SPF = 'spf',
  DKIM = 'dkim',
  NONE = 'none',
}

export const getDnsRecordTypeKeyFromDnsRecordType = (
  type: DnsRecordType,
): DnsRecordTypeKey => {
  switch (type) {
    case DnsRecordType.SRV:
      return DnsRecordTypeKey.SRV;
    case DnsRecordType.SPF:
      return DnsRecordTypeKey.SPF;
    case DnsRecordType.MX:
      return DnsRecordTypeKey.MX;
    default:
      return DnsRecordTypeKey.NONE;
  }
};

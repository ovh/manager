export enum FieldTypePointingRecordsEnum {
  A = 'A',
  AAAA = 'AAAA',
  NS = 'NS',
  CNAME = 'CNAME',
  DNAME = 'DNAME',
}

export enum FieldTypeExtendedRecordsEnum {
  CAA = 'CAA',
  TXT = 'TXT',
  NAPTR = 'NAPTR',
  SRV = 'SRV',
  LOC = 'LOC',
  SSHFP = 'SSHFP',
  TLSA = 'TLSA',
  RP = 'RP',
  SVCB = 'SVCB',
  HTTPS = 'HTTPS',
}

export enum FieldTypeMailRecordsEnum {
  MX = 'MX',
  SPF = 'SPF',
  DKIM = 'DKIM',
  DMARC = 'DMARC',
}

export enum RecordTypesWithoutTTLEnum {
  SPF = 'SPF',
  DKIM = 'DKIM',
  DMARC = 'DMARC',
}

export enum RecordTypesAsTxtEnum {
  SPF = 'SPF',
  DKIM = 'DKIM',
  DMARC = 'DMARC',
}

export enum RecordTypesTargetWithTrailingDotEnum {
  NS = 'NS',
  CNAME = 'CNAME',
  DNAME = 'DNAME',
}

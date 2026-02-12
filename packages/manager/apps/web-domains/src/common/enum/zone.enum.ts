export enum FieldTypePointingRecordsEnum {
  A = 'A',
  AAAA = 'AAAA',
  CNAME = 'CNAME',
  DNAME = 'DNAME',
  NS = 'NS',
}

export enum FieldTypeExtendedRecordsEnum {
  CAA = 'CAA',
  HTTPS = 'HTTPS',
  LOC = 'LOC',
  NAPTR = 'NAPTR',
  RP = 'RP',
  SRV = 'SRV',
  SSHFP = 'SSHFP',
  SVCB = 'SVCB',
  TLSA = 'TLSA',
  TXT = 'TXT',
}

export enum FieldTypeMailRecordsEnum {
  DMARC = 'DMARC',
  DKIM = 'DKIM',
  MX = 'MX',
  SPF = 'SPF',
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

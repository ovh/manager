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
  MX = 'MX',
  DMARC = 'DMARC',
  DKIM = 'DKIM',
  SPF = 'SPF',
}

export enum RecordTypesWithoutTTLEnum {
  SPF = 'SPF',
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

export enum NaptrFlagEnum {
  S = 'S',
  A = 'A',
  U = 'U',
  P = 'P',
}

export enum CaaTagEnum {
  ISSUE = 'issue',
  ISSUEWILD = 'issuewild',
  IODEF = 'iodef',
}

export enum TtlSelectEnum {
  GLOBAL = 'global',
  CUSTOM = 'custom',
}

export enum DkimStatusEnum {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export enum LocLatitudeEnum {
  N = 'N',
  S = 'S',
}

export enum LocLongitudeEnum {
  E = 'E',
  W = 'W',
}

export enum BoolSelectEnum {
  YES = 'yes',
  NO = 'no',
}

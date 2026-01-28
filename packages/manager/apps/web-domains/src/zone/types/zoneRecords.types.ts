export type ZoneRecordFieldType =
  | 'A'
  | 'AAAA'
  | 'CAA'
  | 'CNAME'
  | 'DKIM'
  | 'DMARC'
  | 'DNAME'
  | 'HTTPS'
  | 'LOC'
  | 'MX'
  | 'NAPTR'
  | 'NS'
  | 'RP'
  | 'SPF'
  | 'SRV'
  | 'SSHFP'
  | 'SVCB'
  | 'TLSA'
  | 'TXT';

export type ZoneRecord = {
  fieldType: ZoneRecordFieldType;
  id: string;
  subDomain: string;
  subDomainToDisplay: string;
  ttl: number;
  target: string;
  targetToDisplay: string;
  zone: string;
  zoneToDisplay: string;
}

export type PaginatedZoneRecords = {
  count: number;
  pagination: number[];
  records: {
    results: ZoneRecord[];
  };
}

export type DomainZoneRecordsResponse = {
  fieldsTypes: ZoneRecordFieldType[];
  fullRecordsIdsList: number[];
  paginatedZone: PaginatedZoneRecords;
}

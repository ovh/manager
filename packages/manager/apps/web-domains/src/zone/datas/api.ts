import { aapi, v6 } from "@ovh-ux/manager-core-api";
import { DomainZoneRecordsResponse, ZoneRecord } from "@/zone/types/zoneRecords.types";

export const getDomainZoneRecords = async (
  serviceName: string,
  offset: number = 0,
  recordsCount: number = 0,
): Promise<DomainZoneRecordsResponse> => {
  const { data } = await aapi.get<DomainZoneRecordsResponse>(
    `sws/domain/${serviceName}/zone/records`,
    {
      params: {
        offset,
        recordsCount,
      },
    },
  );
  return data as DomainZoneRecordsResponse;
};

export type CreateZoneRecordPayload = {
  fieldType: string;
  subDomain?: string;
  target: string;
  ttl?: number;
};

/**
 * Check that no CNAME record already exists for the given subdomain.
 * GET /domain/zone/{serviceName}/record?fieldType=CNAME&subDomain={subDomain}
 * If records are returned, a CNAME conflict exists and an error is thrown.
 */
export const validateZoneRecord = async (
  serviceName: string,
  subDomain: string,
): Promise<void> => {
  const { data } = await v6.get<number[]>(
    `/domain/zone/${serviceName}/record`,
    {
      params: {
        fieldType: 'CNAME',
        subDomain: subDomain === '@' ? '' : (subDomain ?? ''),
      },
    },
  );
  if (data.length > 0) {
    throw new Error('CNAME_ALREADY_EXISTS');
  }
};

/**
 * Create a zone record.
 * POST /domain/zone/{serviceName}/record
 */
export const createZoneRecord = async (
  serviceName: string,
  payload: CreateZoneRecordPayload,
): Promise<ZoneRecord> => {
  const { data } = await v6.post<ZoneRecord>(
    `/domain/zone/${serviceName}/record`,
    {
      fieldType: payload.fieldType,
      subDomain: payload.subDomain ?? '',
      target: payload.target,
      ttl: payload.ttl,
    },
  );
  return data;
};

export type UpdateZoneRecordPayload = {
  subDomain?: string;
  target: string;
  ttl?: number;
};

/**
 * Update a zone record.
 * PUT /domain/zone/{serviceName}/record/{recordId}
 */
export const updateZoneRecord = async (
  serviceName: string,
  recordId: string,
  payload: UpdateZoneRecordPayload,
): Promise<void> => {
  await v6.put(
    `/domain/zone/${serviceName}/record/${recordId}`,
    {
      subDomain: payload.subDomain ?? '',
      target: payload.target,
      ttl: payload.ttl,
    },
  );
};

/**
 * Refresh the zone (apply pending changes).
 * POST /domain/zone/{serviceName}/refresh
 */
export const refreshZone = async (serviceName: string): Promise<void> => {
  await v6.post(`/domain/zone/${serviceName}/refresh`);
};

export const deleteDomainZoneRecord = async (
  serviceName: string,
  recordId: string,
): Promise<void> => {
  await v6.delete(`/domain/zone/${serviceName}/record/${recordId}`);
};

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
 * Validate a zone record syntax before creating it.
 * GET /domain/zone/{serviceName}/record?fieldType={fieldType}&subDomain={subDomain}
 * If the syntax is invalid, the API will return an error.
 */
export const validateZoneRecord = async (
  serviceName: string,
  payload: Pick<CreateZoneRecordPayload, 'fieldType' | 'subDomain'>,
): Promise<number[]> => {
  const { data } = await v6.get<number[]>(
    `/domain/zone/${serviceName}/record`,
    {
      params: {
        fieldType: payload.fieldType,
        subDomain: payload.subDomain ?? '',
      },
    },
  );
  return data;
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

/**
 * Refresh the zone (apply pending changes).
 * POST /domain/zone/{serviceName}/refresh
 */
export const refreshZone = async (serviceName: string): Promise<void> => {
  await v6.post(`/domain/zone/${serviceName}/refresh`);
};
import { toASCII } from "punycode";
import { aapi, v6 } from "@ovh-ux/manager-core-api";
import {
  DomainZoneRecordsResponse,
  ZoneRecord,
} from "@/zone/types/zoneRecords.types";

export interface AddZoneRecordPayload {
  fieldType: string;
  subDomain?: string;
  subDomainToDisplay?: string;
  target: string;
  ttl?: number;
}

export interface ModifyZoneRecordPayload {
  subDomain: string;
  target: string;
  ttl?: number;
}

export interface CheckRecordCanBeAddEntry {
  fieldType: string;
  subDomainToDisplay?: string;
  subDomain?: string;
  target: string;
  excludeId?: string;
}

export interface ConflictingRecordDisplay extends Record<string, unknown> {
  domainToDisplay: string;
  fieldType: string;
  targetToDisplay: string;
}

export interface CheckRecordCanBeAddResult {
  recordCanBeAdded: boolean;
  conflictingRecords?: ConflictingRecordDisplay[];
}

export const getDomainZoneRecords = async (
  serviceName: string,
  offset: number = 0,
  recordsCount: number = 0,
  search?: string,
  searchedType?: string,
): Promise<DomainZoneRecordsResponse> => {
  const params: Record<string, string | number | undefined> = {
    offset,
    recordsCount,
  };
  if (search != null) params.search = search.toLowerCase();
  if (searchedType != null) params.searchedType = searchedType;

  const { data } = await aapi.get<DomainZoneRecordsResponse>(
    `sws/domain/${serviceName}/zone/records`,
    { params },
  );
  return data as DomainZoneRecordsResponse;
};


export const getDomainZoneRecordIds = async (
  zoneName: string,
  opts?: { fieldType?: string; subDomain?: string },
): Promise<string[]> => {
  const params: Record<string, string | undefined> = {};
  if (opts?.fieldType) params.fieldType = opts.fieldType;
  if (opts?.subDomain != null) params.subDomain = opts.subDomain || "";

  const { data } = await v6.get<string[]>(
    `/domain/zone/${zoneName}/record`,
    { params },
  );
  return Array.isArray(data) ? data.map(String) : [];
};

export const checkIfRecordCanBeAdd = async (
  serviceName: string,
  entry: CheckRecordCanBeAddEntry,
): Promise<CheckRecordCanBeAddResult> => {
  const subDomain =
    entry.subDomainToDisplay != null && entry.subDomainToDisplay !== ""
      ? (() => {
          try {
            return toASCII(entry.subDomainToDisplay || "");
          } catch {
            return entry.subDomainToDisplay || "";
          }
        })()
      : entry.subDomain ?? "";

  if (entry.fieldType?.toUpperCase() === "CNAME") {
    const results = await getDomainZoneRecords(
      serviceName,
      0,
      100,
      subDomain,
      undefined,
    );
    const records = results?.paginatedZone?.records?.results ?? [];
    const subLower = subDomain.toLowerCase();
    const existingSubDomain = records.filter(
      (zone) =>
        zone.subDomain.toLowerCase() === subLower &&
        String(zone.id) !== String(entry.excludeId ?? ""),
    );
    const conflictingRecords: ConflictingRecordDisplay[] = existingSubDomain.map(
      (r) => ({
        domainToDisplay: `${(r.subDomainToDisplay ? `${r.subDomainToDisplay}.` : "")}${r.zoneToDisplay}.`,
        fieldType: r.fieldType,
        targetToDisplay: r.targetToDisplay ?? r.target,
      }),
    );
    return {
      recordCanBeAdded: existingSubDomain.length === 0,
      conflictingRecords,
    };
  }

  const recordIds = await getDomainZoneRecordIds(serviceName, {
    fieldType: "CNAME",
    subDomain,
  });
  const filtered = recordIds.filter(
    (id) => String(id) !== String(entry.excludeId ?? ""),
  );
  return { recordCanBeAdded: filtered.length === 0 };
};

export const postDomainZoneRecord = async (
  serviceName: string,
  payload: AddZoneRecordPayload,
): Promise<void> => {
  const subDomain = payload.subDomainToDisplay ?? payload.subDomain ?? undefined;
  await v6.post(`/domain/zone/${serviceName}/record`, {
    fieldType: payload.fieldType,
    subDomain: subDomain || undefined,
    target: payload.target,
    ttl: payload.ttl != null ? Number(payload.ttl) : undefined,
  });
};


export const putDomainZoneRecord = async (
  serviceName: string,
  recordId: string,
  payload: ModifyZoneRecordPayload,
): Promise<void> => {
  const { subDomain, target, ttl } = payload;
  await v6.put(`/domain/zone/${serviceName}/record/${recordId}`, {
    subDomain: subDomain ?? "",
    target,
    ttl: ttl != null ? Number(ttl) : undefined,
  });
};

export const deleteDomainZoneRecords = async (
  serviceName: string,
  recordIds: string | string[],
): Promise<void> => {
  const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
  const encodedServiceName = encodeURIComponent(serviceName);
  const { data } = await aapi.delete<void>(
    `sws/domain/zone/${encodedServiceName}/records`,
    { data: { records: ids } },
  );
  return data;
};

export const deleteDomainZoneRecord = async (
  serviceName: string,
  recordId: string,
): Promise<void> => {
  await v6.delete(`/domain/zone/${serviceName}/record/${recordId}`);
};
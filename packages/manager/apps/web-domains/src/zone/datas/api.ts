import { aapi } from "@ovh-ux/manager-core-api";
import { DomainZoneRecordsResponse } from "@/zone/types/zoneRecords.types";

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

  

  
import { aapi } from '@ovh-ux/manager-core-api';

import { IpTypeEnum } from '@/data/constants';
import { ExportIpToCsvData } from '@/data/hooks';

export type GetIpExportParams = {
  ip?: string;
  isAdditionalIp?: boolean;
  type?: IpTypeEnum;
  serviceName?: string | null;
  version?: number;
};

export type IpExportType = {
  data: ExportIpToCsvData[];
};

/**
 * Your IP : Get this object properties
 */
export const getIpExport = async (
  params: GetIpExportParams,
): Promise<IpExportType> =>
  aapi.get<IpExportType>('/ipsexportcsv', { params }).then(({ data }) => data);

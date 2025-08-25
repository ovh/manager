import { aapi } from '@ovh-ux/manager-core-api';
import { ExportIpToCsvData } from '@/data/hooks';
import { IpTypeEnum } from './ipDetails';

export type GetIpExportParams = {
  ip?: string;
  isAdditionalIp?: boolean;
  type?: IpTypeEnum;
  serviceName?: string;
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
  aapi.get('/ipsexportcsv', { params }).then(({ data }) => data);

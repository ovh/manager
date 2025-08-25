import { aapi } from '@ovh-ux/manager-core-api';
import { GetIpListParams } from './ipList';
import { ExportIpToCsvData } from '@/data/hooks';

export type GetIpExportParams = GetIpListParams & {
  serviceName: string;
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

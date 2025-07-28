import { aapi } from '@ovh-ux/manager-core-api';

type IpExportResponse = {
  data: string[];
};

/**
 * Export IP addresses in CSV format.
 */
export const getIpExport = async () => {
  const { data } = await aapi.get<IpExportResponse>(`/ipsrevamp/ips`);
  const ips = data.data;
  const csvContent = ips.join('\n');

  return csvContent;
};

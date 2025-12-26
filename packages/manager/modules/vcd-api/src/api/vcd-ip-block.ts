import { v2 } from '@ovh-ux/manager-core-api';
import { getVcdIpBlockListRoute } from '../utils';
import { VCDIpBlock } from '../types';

export const getVcdIpBlocks = async (id: string): Promise<VCDIpBlock[]> => {
  const { data } = await v2.get<VCDIpBlock[]>(getVcdIpBlockListRoute(id));
  return data;
};

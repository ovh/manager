import { TGateway } from '@/api/data/subnets';

export const isValidGateway = (gateways: TGateway[]) =>
  Boolean(Array.isArray(gateways) && gateways.length);

import { GetSubnetsPort } from '@/application/ports/getSubnets.port';

export const getSubnetsUseCase =
  (getSubnetsPort: GetSubnetsPort): GetSubnetsPort['getSubnets'] =>
  async (query) =>
    getSubnetsPort.getSubnets(query);

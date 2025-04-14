import { v6 } from '@ovh-ux/manager-core-api';
import { TCertificate } from '@/types/ssl';

export const createCertificate = async (
  serviceName: string,
  certificate?: string,
  key?: string,
  chain?: string,
): Promise<TCertificate> => {
  const { data } = await v6.post<TCertificate>(
    `/hosting/web/${serviceName}/ssl`,
    {
      certificate,
      key,
      chain,
    },
  );

  return data;
};

import { v6 } from '@ovh-ux/manager-core-api';

import { CdnOption, ServiceNameCdn, TCdnOption, TCdnOptions } from '../types/product/cdn';

export const getServiceNameCdn = async (serviceName: string): Promise<ServiceNameCdn> => {
  const { data } = await v6.get<ServiceNameCdn>(`/hosting/web/${serviceName}/cdn`);
  return data;
};

export const getCdnOption = async (serviceName: string, domain: string): Promise<CdnOption[]> => {
  const { data } = await v6.get<CdnOption[]>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option`,
  );
  return data;
};

export const createCdnOption = async ({
  serviceName,
  domain,
  cdnOption,
}: TCdnOption): Promise<CdnOption> => {
  const { data } = await v6.post<CdnOption>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option`,
    {
      ...cdnOption,
    },
  );
  return data;
};

export const updateCdnOption = async ({
  serviceName,
  domain,
  option,
  cdnOption,
}: TCdnOption): Promise<CdnOption> => {
  const { data } = await v6.put<CdnOption>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option/${option}`,
    {
      ...cdnOption,
    },
  );
  return data;
};

export const updateCdnOptions = async ({
  serviceName,
  domain,
  cdnOptions,
}: TCdnOptions): Promise<PromiseSettledResult<CdnOption>[]> => {
  const promises = cdnOptions.map((item) => {
    const { name, ...cdnOption } = item;
    return updateCdnOption({
      serviceName,
      domain,
      option: name,
      cdnOption,
    });
  });

  const results = await Promise.allSettled(promises);
  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failed) {
    throw failed.reason ?? new Error('Domain certificate creation failed');
  }

  return results;
};

export const deleteCdnOption = async ({
  serviceName,
  domain,
  option,
}: TCdnOption): Promise<void> => {
  await v6.delete<void>(`/hosting/web/${serviceName}/cdn/domain/${domain}/option/${option}`);
};

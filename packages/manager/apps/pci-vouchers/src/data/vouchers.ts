import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { Voucher } from '@/interface';

export const getVouchers = async (projectId: string): Promise<Voucher[]> => {
  const { data } = await fetchIcebergV6({
    route: `/cloud/project/${projectId}/credit`,
  });

  // return data as Voucher[];
  return ([
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
  ] as Voucher[]).map((a: Voucher, index: number) => {
    return {
      ...a,
      voucher: a.description + index,
    };
  });
};

export default getVouchers;

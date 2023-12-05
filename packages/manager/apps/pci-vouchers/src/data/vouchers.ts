import { fetchIceberg } from '@ovh-ux/manager-core-api';
import { Voucher } from '@/interface';

export const getVouchers = async (projectId: string): Promise<Voucher[]> => {
  const { data } = await fetchIceberg({
    route: `/cloud/project/${projectId}/credit`,
  });
  const vouchers = data as Voucher[];
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  vouchers.push(...vouchers);
  return vouchers;
};

export default getVouchers;

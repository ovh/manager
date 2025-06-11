import { v6 } from '@ovh-ux/manager-core-api';

import { TEligibility, TEligibilityVoucher } from '@/data/models/Eligibility.type';

export const getEligibility = async (): Promise<TEligibility> => {
  const { data } = await v6.get<TEligibility>(`/cloud/eligibility`);

  return data;
};

export const checkVoucherEligibility = async (
  voucher: string,
): Promise<TEligibilityVoucher | undefined> => {
  const { data } = await v6.get<{ voucher?: TEligibilityVoucher }>(
    `/cloud/eligibility?voucher=${voucher}`,
  );

  return data?.voucher;
};

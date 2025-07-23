import { v6 } from '@ovh-ux/manager-core-api';
import {
  TEligibility,
  TEligibilityVoucher,
} from '@/data/types/payment/eligibility.type';

export const getEligibility = async (): Promise<TEligibility | undefined> => {
  return v6.get(`/cloud/eligibility`).then((d) => d?.data);
};

export const checkVoucherEligibility = async (
  voucher: string,
): Promise<TEligibilityVoucher | undefined> => {
  const { data } = await v6.get(`/cloud/eligibility?voucher=${voucher}`);

  return data?.voucher;
};

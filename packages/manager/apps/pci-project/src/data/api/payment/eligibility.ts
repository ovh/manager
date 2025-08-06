import { v6 } from '@ovh-ux/manager-core-api';
import {
  TEligibility,
  TEligibilityVoucher,
} from '@/data/types/payment/eligibility.type';

export const getEligibility = async (): Promise<TEligibility> => {
  const { data } = await v6.get(`/cloud/eligibility`);

  return data;
};

export const checkVoucherEligibility = async (
  voucher: string,
): Promise<TEligibilityVoucher | undefined> => {
  const { data } = await v6.get(`/cloud/eligibility?voucher=${voucher}`);

  return data?.voucher;
};

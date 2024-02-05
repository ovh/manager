import { v6 } from '@ovh-ux/manager-core-api';

export async function addVoucher(projectId: string, code: string) {
  return v6
    .post(`/cloud/project/${projectId}/credit`, {
      code,
    })
    .then(({ data }) => data)
    .catch(({ response }) =>
      Promise.reject(new Error(response?.data?.message)),
    );
}

export type BuyCreditResult = {
  url: string;
  amount: number;
};

export async function buyCredit(
  projectId: string,
  amount: number,
): Promise<BuyCreditResult> {
  return v6
    .post(`/order/cloud/project/${projectId}/credit`, { amount })
    .then(
      ({ data }) =>
        ({
          amount,
          url: data.url,
        } as BuyCreditResult),
    )
    .catch(({ response }) =>
      Promise.reject(new Error(response?.data?.message)),
    );
}

export default {
  addVoucher,
  buyCredit,
};

import { v6 } from '@ovh-ux/manager-core-api';

export async function getBill(billId: string) {
  return v6
    .get(`/me/bill/${billId}`)
    .then(({ data }) => data)
    .catch(({ response }) =>
      Promise.reject(new Error(response?.data?.message)),
    );
}

export default {
  getBill,
};

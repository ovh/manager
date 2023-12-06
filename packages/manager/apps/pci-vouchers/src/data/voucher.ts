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

export default {
  addVoucher,
};

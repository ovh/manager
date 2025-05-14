import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { ActionNameEnum } from '@/enum/actionName.enum';
//  Actions
export const updateOperationStatus = async (
  product: string,
  id: number,
  operationName:
    | ActionNameEnum.CanAccelerate
    | ActionNameEnum.CanCancel
    | ActionNameEnum.CanRelaunch,
): Promise<AxiosResponse> => {
  const { data } = await v6.post(`/me/task/${product}/${id}/${operationName}`);
  return data;
};

import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosResponse } from 'axios';
import { OperationName } from '@/enum/actionName.enum';
//  Actions
export const updateOperationStatus = async (
  universe: string,
  id: number,
  operationName:
    | OperationName.CanAccelerate
    | OperationName.CanCancel
    | OperationName.CanRelaunch,
): Promise<AxiosResponse> => {
  const { data } = await v6.post(`/me/task/${universe}/${id}/${operationName}`);
  return data;
};

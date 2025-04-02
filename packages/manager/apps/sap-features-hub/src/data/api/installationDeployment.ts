import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { InstallationDetails } from '@/types/installation.type';

export type GetInstallationTaskDetailsRouteParams = {
  serviceName: string;
  taskId: string;
};

const getInstallationTaskDetailsRoute = ({
  serviceName,
  taskId,
}: GetInstallationTaskDetailsRouteParams) =>
  `/dedicatedCloud/${serviceName}/sap/${taskId}`;

export const getInstallationTaskDetails = async ({
  serviceName,
  taskId,
}: GetInstallationTaskDetailsRouteParams): Promise<ApiResponse<
  InstallationDetails
>> => v6.get(getInstallationTaskDetailsRoute({ serviceName, taskId }));

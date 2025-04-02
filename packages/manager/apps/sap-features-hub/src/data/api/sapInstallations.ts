import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import {
  TSAPInstallation,
  InstallationDetails,
} from '@/types/installation.type';
import {
  getVMwareSAPInstallationsRoute,
  getInstallationTaskDetailsRoute,
} from '@/utils/apiRoutes.constants';

export type TGetInstallationTaskParams = {
  serviceName: string;
  taskId: string;
};

export const getSAPInstallations = async (
  serviceName: string,
): Promise<ApiResponse<TSAPInstallation[]>> =>
  v6.get(getVMwareSAPInstallationsRoute(serviceName));

export const getInstallationTaskDetails = async ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams): Promise<ApiResponse<InstallationDetails>> =>
  v6.get(getInstallationTaskDetailsRoute({ serviceName, taskId }));

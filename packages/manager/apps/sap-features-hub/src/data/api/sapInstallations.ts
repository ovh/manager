import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import {
  TSAPInstallation,
  InstallationDetails,
} from '@/types/installation.type';
import {
  getVMwareSAPInstallationsRoute,
  getInstallationTaskDetailsRoute,
} from '@/utils/apiRoutes.constants';
import { StructuredInstallationForm } from '@/types/form.type';

export type TGetInstallationTaskParams = {
  serviceName: string;
  taskId: string;
};

type TCreateInstallationParams = {
  serviceName: string;
  form: StructuredInstallationForm;
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

export const createInstallation = ({
  serviceName,
  form,
}: TCreateInstallationParams): Promise<ApiResponse<string>> =>
  v6.post(`/dedicatedCloud/${serviceName}/sap`, form);

export const deleteInstallation = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams): Promise<ApiResponse<string>> =>
  v6.delete(`/dedicatedCloud/${serviceName}/sap/${taskId}`);

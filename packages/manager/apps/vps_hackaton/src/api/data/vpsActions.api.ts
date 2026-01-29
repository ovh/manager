import { v6 } from '@ovh-ux/manager-core-api';
import type { TTask } from '@/domain/entities/task';

export type TRebootParams = {
  serviceName: string;
};

export type TStopParams = {
  serviceName: string;
};

export type TStartParams = {
  serviceName: string;
};

export type TRescueParams = {
  serviceName: string;
  password?: string;
};

export type TResetPasswordParams = {
  serviceName: string;
};

export type TRebuildParams = {
  serviceName: string;
  imageId: string;
  sshKey?: string;
  doNotSendPassword?: boolean;
  installRTM?: boolean;
};

export const rebootVps = async (params: TRebootParams): Promise<TTask> => {
  const { data } = await v6.post<TTask>(`/vps/${params.serviceName}/reboot`);
  return data;
};

export const stopVps = async (params: TStopParams): Promise<TTask> => {
  const { data } = await v6.post<TTask>(`/vps/${params.serviceName}/stop`);
  return data;
};

export const startVps = async (params: TStartParams): Promise<TTask> => {
  const { data } = await v6.post<TTask>(`/vps/${params.serviceName}/start`);
  return data;
};

export const rescueVps = async (params: TRescueParams): Promise<TTask> => {
  // First set netboot mode to rescue
  await v6.put(`/vps/${params.serviceName}`, {
    netbootMode: 'rescue',
  });

  // Then reboot
  const { data } = await v6.post<TTask>(`/vps/${params.serviceName}/reboot`);
  return data;
};

export const resetPasswordVps = async (
  params: TResetPasswordParams,
): Promise<TTask> => {
  const { data } = await v6.post<TTask>(
    `/vps/${params.serviceName}/setPassword`,
  );
  return data;
};

export const getKvmConsoleUrl = async (
  serviceName: string,
): Promise<string> => {
  const { data } = await v6.post<{ url: string }>(
    `/vps/${serviceName}/getConsoleUrl`,
  );
  return data.url;
};

export const rebuildVps = async (params: TRebuildParams): Promise<TTask> => {
  const { data } = await v6.post<TTask>(`/vps/${params.serviceName}/rebuild`, {
    imageId: params.imageId,
    sshKey: params.sshKey,
    doNotSendPassword: params.doNotSendPassword,
    installRTM: params.installRTM,
  });
  return data;
};

export const updateVpsDisplayName = async (
  serviceName: string,
  displayName: string,
): Promise<void> => {
  await v6.put(`/vps/${serviceName}`, { displayName });
};

export const exitRescueMode = async (serviceName: string): Promise<TTask> => {
  // Set netboot mode back to local
  await v6.put(`/vps/${serviceName}`, {
    netbootMode: 'local',
  });

  // Reboot
  const { data } = await v6.post<TTask>(`/vps/${serviceName}/reboot`);
  return data;
};

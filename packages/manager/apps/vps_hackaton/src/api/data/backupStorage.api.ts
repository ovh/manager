import { v6 } from '@ovh-ux/manager-core-api';
import type {
  TBackupStorage,
  TBackupStorageAcl,
} from '@/domain/entities/backupStorage';
import type {
  TBackupStorageDTO,
  TBackupStorageAclDTO,
} from '@/adapters/api/backupStorage/dto.type';
import {
  mapBackupStorageDtoToEntity,
  mapBackupStorageAclDtoToEntity,
} from '@/adapters/api/backupStorage/mapper';

export const getBackupStorage = async (
  serviceName: string,
): Promise<TBackupStorage | null> => {
  try {
    const [storageResponse, aclsResponse] = await Promise.all([
      v6.get<TBackupStorageDTO>(`/vps/${serviceName}/backupftp`),
      v6.get<Array<TBackupStorageAclDTO>>(`/vps/${serviceName}/backupftp/access`),
    ]);
    return mapBackupStorageDtoToEntity(storageResponse.data, aclsResponse.data);
  } catch (error) {
    // 404 means backup storage is not enabled
    return null;
  }
};

export const getBackupStorageAcls = async (
  serviceName: string,
): Promise<Array<TBackupStorageAcl>> => {
  const { data } = await v6.get<Array<TBackupStorageAclDTO>>(
    `/vps/${serviceName}/backupftp/access`,
  );
  return data.map(mapBackupStorageAclDtoToEntity);
};

export const resetBackupStoragePassword = async (
  serviceName: string,
): Promise<{ password: string }> => {
  const { data } = await v6.post<{ password: string }>(
    `/vps/${serviceName}/backupftp/password`,
  );
  return data;
};

export type TAddAclParams = {
  serviceName: string;
  ipBlock: string;
  ftp: boolean;
  nfs: boolean;
  cifs: boolean;
};

export const addBackupStorageAcl = async (
  params: TAddAclParams,
): Promise<void> => {
  await v6.post(`/vps/${params.serviceName}/backupftp/access`, {
    ipBlock: params.ipBlock,
    ftp: params.ftp,
    nfs: params.nfs,
    cifs: params.cifs,
  });
};

export const deleteBackupStorageAcl = async (
  serviceName: string,
  ipBlock: string,
): Promise<void> => {
  await v6.delete(
    `/vps/${serviceName}/backupftp/access/${encodeURIComponent(ipBlock)}`,
  );
};

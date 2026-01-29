import type {
  TBackupStorage,
  TBackupStorageAcl,
} from '@/domain/entities/backupStorage';
import type { TBackupStorageDTO, TBackupStorageAclDTO } from './dto.type';

export const mapBackupStorageAclDtoToEntity = (
  dto: TBackupStorageAclDTO,
): TBackupStorageAcl => ({
  ipBlock: dto.ipBlock,
  ftp: dto.ftp,
  nfs: dto.nfs,
  cifs: dto.cifs,
});

export const mapBackupStorageDtoToEntity = (
  dto: TBackupStorageDTO,
  acls: Array<TBackupStorageAclDTO>,
): TBackupStorage => ({
  quota: dto.quota,
  usage: dto.usage,
  ftpUrl: dto.ftpUrl,
  access: {
    ftp: dto.access.ftp,
    nfs: dto.access.nfs,
    cifs: dto.access.cifs,
  },
  acls: acls.map(mapBackupStorageAclDtoToEntity),
});

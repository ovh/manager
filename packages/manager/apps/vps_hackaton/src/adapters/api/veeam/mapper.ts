import type {
  TVeeamBackup,
  TVeeamBackupState,
  TRestorePoint,
  TRestorePointState,
} from '@/domain/entities/veeam';
import type { TVeeamBackupDTO, TRestorePointDTO } from './dto.type';

export const mapRestorePointDtoToEntity = (
  dto: TRestorePointDTO,
): TRestorePoint => ({
  id: dto.id,
  creationDate: dto.creationDate,
  state: dto.state as TRestorePointState,
});

export const mapVeeamBackupDtoToEntity = (
  dto: TVeeamBackupDTO,
): TVeeamBackup => ({
  state: dto.state as TVeeamBackupState,
  scheduledTime: dto.scheduledTime,
  accessInfos: {
    ftp: dto.access.ftp,
    nfs: dto.access.nfs,
    cifs: dto.access.cifs,
  },
  restorePoints: dto.restorePoints.map(mapRestorePointDtoToEntity),
});

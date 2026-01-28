import { TBackup } from '@/domain/entities/backup';
import { TBackupDTO } from './dto.type';

export const mapBackupDtoToBackupEntity = (
  backupsDTO: TBackupDTO[],
): TBackup[] =>
  backupsDTO.map(
    ({ id, name, type, minDisk, minRam, region, size, creationDate }) => ({
      id,
      name,
      type,
      minDisk,
      minRam,
      region,
      size,
      creationDate,
    }),
  );

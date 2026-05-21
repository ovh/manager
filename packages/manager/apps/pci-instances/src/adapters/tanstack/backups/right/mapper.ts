import { TBackup } from '@/domain/entities/backup';
import { TBackupDTO } from './dto.type';

const MB_PER_GB = 1024;

export const mapBackupDtoToBackupEntity = (
  backupsDTO: TBackupDTO[],
): TBackup[] =>
  backupsDTO.map(
    ({ id, name, type, minDisk, minRam, region, size, creationDate }) => ({
      id,
      name,
      type,
      minDisk,
      minRam: minRam / MB_PER_GB,
      region,
      size,
      creationDate,
    }),
  );

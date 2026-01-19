import { TBackup } from '@/domain/entities/backup';
import { TBackupDTO } from './dto.type';

export const mapBackupDtoToBackupEntity = (
  BackupsDTO: TBackupDTO[],
): TBackup[] =>
  BackupsDTO.map(
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

import { describe, it, expect } from 'vitest';
import { mapBackupDtoToBackupEntity } from '../mapper';
import { TBackupDTO } from '../dto.type';

describe('mapBackupDtoToBackupEntity', () => {
  const dto: TBackupDTO = {
    id: 'b1',
    name: 'backup_one',
    type: 'linux',
    minDisk: 200,
    minRam: 1024,
    region: 'GRA9',
    size: 214781394944,
    creationDate: '2026-05-20T22:40:37Z',
  };

  it('converts minRam from MB (DTO) to GB (entity)', () => {
    const [backup] = mapBackupDtoToBackupEntity([dto]);
    expect(backup?.minRam).toBe(1);
  });

  it('keeps minDisk as-is (already in GB)', () => {
    const [backup] = mapBackupDtoToBackupEntity([dto]);
    expect(backup?.minDisk).toBe(200);
  });

  it('returns an empty array when given empty DTO array', () => {
    expect(mapBackupDtoToBackupEntity([])).toStrictEqual([]);
  });
});

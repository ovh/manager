import type { TSnapshot, TSnapshotState } from '@/domain/entities/snapshot';
import type { TSnapshotDTO } from './dto.type';

export const mapSnapshotDtoToEntity = (
  dto: TSnapshotDTO,
  serviceName: string,
): TSnapshot => ({
  id: `${serviceName}-snapshot`,
  creationDate: dto.creationDate,
  description: dto.description,
  state: dto.state as TSnapshotState,
});

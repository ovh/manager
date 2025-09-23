import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';

export type InstancesCatalogPort = {
  selectInstancesCatalog: (projectId: string) => TInstancesCatalog | undefined;
};

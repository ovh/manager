import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';

export type TInstancesCatalogPort = {
  selectInstancesCatalog: (projectId: string) => TInstancesCatalog | undefined;
};

import { Deps } from '@/deps/deps';
import { Reader } from '@/types/utils.type';

export type TImageTypesOptions = { label: string; value: string };

type TSelectImageTypesData = (projectId: string) => TImageTypesOptions[];

type TSelectImageTypes = Reader<Deps, TSelectImageTypesData>;

export const selectImagesTypes: TSelectImageTypes = (deps) => (projectId) => {
  const { instancesCatalogPort, messageProviderPort } = deps;
  const entities = instancesCatalogPort.selectInstancesCatalog(projectId)
    ?.entities;

  if (!entities) return [];

  return entities.imageTypes.allIds.map((type) => ({
    label: messageProviderPort.getMessage(
      `pci_instances_common_${type}_image_type`,
    ),
    value: type,
  }));
};

import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';
import {
  mapDisksToViewModel,
  TDiskViewModel,
} from '@/pages/instances/create/view-models/mappers/diskMapper';

const findFlavorNamed = (catalog: TInstancesCatalog, flavorName: string) => {
  const flavors = catalog.entities.flavors;

  const namedAlike = flavors.allIds.find(
    (name) => name.toLowerCase() === flavorName.toLowerCase(),
  );

  return flavors.byId.get(flavorName) ?? flavors.byId.get(namedAlike ?? '');
};

export const selectFlavorDisks = (flavorName: string | null) => (
  catalog?: TInstancesCatalog,
): TDiskViewModel[] | null => {
  if (!flavorName || !catalog) return null;

  const flavor = findFlavorNamed(catalog, flavorName);

  return flavor ? mapDisksToViewModel(flavor.specifications.disks) : null;
};

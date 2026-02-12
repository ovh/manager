import { format } from 'date-fns';
import { TInstancesCatalog } from '@/domain/entities/instancesCatalog';

export const getOvhInstanceName = (
  catalog: TInstancesCatalog,
  regionalizedFlavorId: string,
) => {
  const regionalizedFlavor = catalog.entities.regionalizedFlavors.byId.get(
    regionalizedFlavorId,
  );

  if (!regionalizedFlavor) return null;

  const flavor = catalog.entities.flavors.byId.get(regionalizedFlavor.flavorId);

  const dateTime = format(new Date(), 'yyyy_MM_dd HH:mm');

  return `${flavor?.name ?? 'instance'} ${dateTime}`;
};

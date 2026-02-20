import { TInstancesCatalog } from '../entities/instancesCatalog';
import { getRegionalizedFlavorId } from '@/utils';

const FLEX_FLAVOR_SUFFIX = '-flex';

export const isFlexFlavorName = (flavorName: string): boolean =>
  flavorName.endsWith(FLEX_FLAVOR_SUFFIX);

export const getFlexFlavorName = (baseFlavorName: string): string =>
  `${baseFlavorName}${FLEX_FLAVOR_SUFFIX}`;

export const getBaseFlavorName = (flavorName: string): string =>
  flavorName.replace(new RegExp(`${FLEX_FLAVOR_SUFFIX}$`), '');

export const getFlexRegionalizedFlavorId = (
  catalog: TInstancesCatalog,
  regionalizedFlavorId: string,
): string | null => {
  const regionalizedFlavor = catalog.entities.regionalizedFlavors.byId.get(
    regionalizedFlavorId,
  );
  if (!regionalizedFlavor) return null;

  const alreadyFlex = isFlexFlavorName(regionalizedFlavor.flavorId);
  if (alreadyFlex) return regionalizedFlavorId;

  const flexRegionalizedId = getRegionalizedFlavorId(
    getFlexFlavorName(regionalizedFlavor.flavorId),
    regionalizedFlavor.regionId,
  );
  const existsInCatalog = catalog.entities.regionalizedFlavors.byId.has(
    flexRegionalizedId,
  );
  return existsInCatalog ? flexRegionalizedId : null;
};

export const getBaseRegionalizedFlavorId = (
  catalog: TInstancesCatalog,
  regionalizedFlavorId: string,
): string | null => {
  const regionalizedFlavor = catalog.entities.regionalizedFlavors.byId.get(
    regionalizedFlavorId,
  );
  if (!regionalizedFlavor) {
    return null;
  }

  const isFlex = isFlexFlavorName(regionalizedFlavor.flavorId);
  if (!isFlex) {
    return regionalizedFlavorId;
  }

  const baseRegionalizedId = getRegionalizedFlavorId(
    getBaseFlavorName(regionalizedFlavor.flavorId),
    regionalizedFlavor.regionId,
  );
  const existsInCatalog = catalog.entities.regionalizedFlavors.byId.has(
    baseRegionalizedId,
  );
  return existsInCatalog ? baseRegionalizedId : null;
};

export const hasFlexVariant = (
  catalog: TInstancesCatalog | undefined,
  regionalizedFlavorId: string | null,
): boolean =>
  Boolean(
    regionalizedFlavorId &&
      catalog &&
      getFlexRegionalizedFlavorId(catalog, regionalizedFlavorId),
  );

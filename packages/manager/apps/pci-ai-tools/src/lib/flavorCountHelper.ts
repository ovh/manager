import ai from '@/types/AI';

type CountedResources =
  | Pick<ai.Resources, 'cpu' | 'gpu' | 'flavorCount'>
  | Pick<ai.ResourcesInput, 'cpu' | 'gpu' | 'flavorCount'>;

type FlavorWithMax = Pick<ai.capabilities.Flavor, 'max'>;

export const getFlavorCount = (resources?: CountedResources) => {
  if (!resources) return 1;

  if (typeof resources.flavorCount === 'number' && resources.flavorCount > 0) {
    return resources.flavorCount;
  }

  if ((resources.gpu ?? 0) > 0) {
    return resources.gpu;
  }

  if ((resources.cpu ?? 0) > 0) {
    return resources.cpu;
  }

  return 1;
};

export const clampFlavorCount = (
  quantity: number,
  flavor?: FlavorWithMax,
) => {
  const normalizedQuantity = Number.isFinite(quantity) ? quantity : 1;
  const boundedQuantity = Math.max(normalizedQuantity, 1);

  if (!flavor) return boundedQuantity;

  return Math.min(boundedQuantity, flavor.max);
};

export const buildFlavorResourcesInput = (
  flavorId: string,
  flavorCount: number,
): ai.ResourcesInput => ({
  flavor: flavorId,
  flavorCount: Number(flavorCount),
});

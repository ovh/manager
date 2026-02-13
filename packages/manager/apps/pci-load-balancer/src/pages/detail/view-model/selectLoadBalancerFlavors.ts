import { TLoadBalancerFlavorWithPricing } from '@/domain/entities/loadBalancerFlavor';

const SIZE_ORDER = ['small', 'medium', 'large', 'xl'];

const getPriceInUcents = (pricing: TLoadBalancerFlavorWithPricing['pricing']): number | null => {
  const hourly = pricing.find((price) => price.type === 'hour');

  if (hourly) return hourly.priceInUcents;

  return pricing.find((price) => price.type === 'none')?.priceInUcents ?? null;
};

const sizeOrderIndex = (size: string): number => {
  const index = SIZE_ORDER.indexOf(size);
  return index === -1 ? SIZE_ORDER.length : index;
};

export const selectLoadBalancerFlavors = (flavors: TLoadBalancerFlavorWithPricing[]) =>
  flavors
    .map((flavor) => ({
      id: flavor.id,
      size: flavor.name,
      priceInUcents: getPriceInUcents(flavor.pricing),
    }))
    .sort((a, b) => sizeOrderIndex(a.size) - sizeOrderIndex(b.size));

/**
 * Projections minimales de la surface de commande Agora (schéma apiv6 `order`, relevé 2026-08-06) :
 * champs réellement consommés seulement, comme `types/Catalog.type.ts` pour le catalogue public.
 * Les noms locaux abrègent ceux du contrat — `CartServiceOffer` = `order.cart.GenericOptionDefinition`,
 * `CartOfferPricing` = `order.cart.GenericProductPricing`,
 * `CartItemRequiredConfiguration` = `order.cart.ConfigurationRequirements`.
 */
import { Price } from '@ovh-ux/manager-module-order';

export type CartPricingCapacity =
  | 'consumption'
  | 'detach'
  | 'downgrade'
  | 'dynamic'
  | 'installation'
  | 'renew'
  | 'upgrade';

export type CartPricingType = 'consumption' | 'purchase' | 'rental';

export type CartOfferPricing = {
  capacities: CartPricingCapacity[];
  description: string;
  /** Durée ISO 8601 attendue par le POST (`P1M`, …), annoncée par l'offre — jamais supposée. */
  duration: string;
  interval: number;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  price: Price;
  /** Prix en micro-centimes, même unité que le catalogue public. */
  priceInUcents: number;
  pricingMode: string;
  pricingType: CartPricingType;
};

export type CartServiceOffer = {
  exclusive: boolean;
  family: string;
  mandatory: boolean;
  planCode: string;
  prices: CartOfferPricing[];
  productName: string;
  productType: string;
};

/** Les quatre paramètres que tout POST de commande exige, aucun optionnel au contrat. */
export type CartOfferOrderParameters = {
  duration: string;
  planCode: string;
  pricingMode: string;
  quantity: number;
};

export type CartServiceOptionCreation = CartOfferOrderParameters & {
  cartId: string;
};

/** Les labels que le panier réclame : ils ne sont pas figés, ils se découvrent à l'exécution. */
export type CartItemRequiredConfiguration = {
  fields: string[] | null;
  label: string;
  required: boolean;
  type: string;
};

export type CartItemConfiguration = {
  label: string;
  value: string;
};

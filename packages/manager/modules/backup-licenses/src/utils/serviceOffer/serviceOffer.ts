import {
  CartOfferDefinition,
  CartOfferOrderParameters,
  CartOfferPricing,
} from '@/types/OrderCart.type';

export const findServiceOffer = <TOffer extends CartOfferDefinition>(
  offers: TOffer[] | undefined,
  planCode: string,
): TOffer | undefined => offers?.find((offer) => offer.planCode === planCode);

/**
 * Une offre publie plusieurs tarifs, un par capacité ; seul celui qui porte `installation` est
 * commandable — les autres tarifent un renouvellement ou un changement de gamme.
 */
export const getOfferInstallationPricing = (
  offer: CartOfferDefinition | undefined,
): CartOfferPricing | undefined =>
  offer?.prices.find(({ capacities }) => capacities.includes('installation'));

/**
 * Le tarif qui porte la période de facturation à commander. `installation` annonce une durée nulle
 * (`P0D`, c'est un frais ponctuel) : le panier l'accepte à l'ajout, puis le checkout le refuse avec
 * « Invalid duration 0 ». C'est donc `renew` qui fait foi, et `installation` seulement à défaut.
 */
export const getOfferOrderablePricing = (
  offer: CartOfferDefinition | undefined,
): CartOfferPricing | undefined =>
  offer?.prices.find(({ capacities }) => capacities.includes('renew')) ??
  getOfferInstallationPricing(offer);

/**
 * Les paramètres du POST lus sur l'offre, jamais devinés : un produit à la conso ne suit pas le
 * `default`/`P1M` mensuel du funnel. `undefined` si l'offre n'est pas commandable en l'état.
 */
export const getOfferOrderParameters = (
  offer: CartOfferDefinition | undefined,
): CartOfferOrderParameters | undefined => {
  const pricing = getOfferOrderablePricing(offer);
  if (!offer || !pricing) return undefined;

  return {
    duration: pricing.duration,
    planCode: offer.planCode,
    pricingMode: pricing.pricingMode,
    // Une offre à la conso peut annoncer un minimum de 0 : on en commande une, pas zéro.
    quantity: Math.max(pricing.minimumQuantity, 1),
  };
};

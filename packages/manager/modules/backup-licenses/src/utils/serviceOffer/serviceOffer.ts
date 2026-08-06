import {
  CartOfferOrderParameters,
  CartOfferPricing,
  CartServiceOffer,
} from '@/types/OrderCart.type';

export const findServiceOffer = (
  offers: CartServiceOffer[] | undefined,
  planCode: string,
): CartServiceOffer | undefined => offers?.find((offer) => offer.planCode === planCode);

/**
 * Une offre publie plusieurs tarifs, un par capacité ; seul celui qui porte `installation` est
 * commandable — les autres tarifent un renouvellement ou un changement de gamme.
 */
export const getOfferInstallationPricing = (
  offer: CartServiceOffer | undefined,
): CartOfferPricing | undefined =>
  offer?.prices.find(({ capacities }) => capacities.includes('installation'));

/**
 * Le tarif prêt à afficher servi par Agora, celui-là même auquel la commande partira. Le front ne
 * formate ni n'arrondit aucun montant (R1) : `Price.text` est déjà localisé par subsidiary, là où
 * un `Intl.NumberFormat` à deux décimales écraserait un tarif au Go sous le centime.
 */
export const getOfferInstallationPriceText = (
  offer: CartServiceOffer | undefined,
): string | undefined => getOfferInstallationPricing(offer)?.price.text || undefined;

/**
 * Les paramètres du POST lus sur l'offre, jamais devinés : un produit à la conso ne suit pas le
 * `default`/`P1M` mensuel du funnel. `undefined` si l'offre n'est pas commandable en l'état.
 */
export const getOfferOrderParameters = (
  offer: CartServiceOffer | undefined,
): CartOfferOrderParameters | undefined => {
  const pricing = getOfferInstallationPricing(offer);
  if (!offer || !pricing) return undefined;

  return {
    duration: pricing.duration,
    planCode: offer.planCode,
    pricingMode: pricing.pricingMode,
    // Une offre à la conso peut annoncer un minimum de 0 : on en commande une, pas zéro.
    quantity: Math.max(pricing.minimumQuantity, 1),
  };
};

import { ZimbraOffer } from '../type';

// necessary for now because slot API doesn't send the information
// of the quota, so it will be hardcoded
export const getOfferDefaultQuota = (offer: keyof typeof ZimbraOffer) => {
  switch (offer) {
    case ZimbraOffer.STARTER:
      // 15Gb
      return 16106127360;
    default:
      // 50Gb
      return 53687091200;
  }
};

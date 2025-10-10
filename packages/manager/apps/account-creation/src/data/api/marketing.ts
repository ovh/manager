import axios from 'axios';
import { getHeaders } from '@ovh-ux/request-tagger';

const baseURL = '/engine/apiv6';
const endpointPath = '/me/marketing';

const axiosInstance = axios.create({
  baseURL,
  headers: getHeaders(endpointPath),
});

type MarketingConsent = {
  denyAll: boolean;
  sms: {
    events: boolean;
    newProductRecommendation: boolean;
    newsletter: boolean;
    offerAndDiscount: boolean;
  };
};

export const putSmsConsent = async (consent = false): Promise<void> => {
  const payload: MarketingConsent = {
    denyAll: !consent,
    sms: {
      events: consent,
      newProductRecommendation: consent,
      newsletter: consent,
      offerAndDiscount: consent,
    },
  };

  await axiosInstance.put(endpointPath, payload);
};

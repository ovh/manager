import { FormattedPaymentType, Payment, PaymentTypes } from '@/models/payment';
import axios from 'axios';

export function getAvailablePaymentMeans(allPayments: PaymentTypes): FormattedPaymentType[] {
  return Object.keys(allPayments)
    .map((key: string) => {
      return {
        id: key,
        isAvailable: allPayments[key],
      };
    })
    .filter((payment) => payment.isAvailable);
}

export async function fetchDefaultPaymentMean(promises: Promise<any>[]) {
  let paymentMeans: Payment[] = [];
  await Promise.all(promises)
    .then((response) => {
      const meansDetailsUrls: string[] = [];
      response.forEach((responseMean) => {
        if (responseMean.data.length > 0) {
          responseMean.data.forEach((paymentMeanId: string) => {
            meansDetailsUrls.push(`${responseMean.config.url}/${paymentMeanId}`);
          });
        }
      });

      const meansDetailsPromises = meansDetailsUrls.map((url) => {
        return axios.get(url);
      });

      Promise.all(meansDetailsPromises)
        .then((detailsReponse) => {
          paymentMeans = detailsReponse.map((details) => {
            return details.data;
          });
        })
        .catch((e) => {
          console.error(e);
          return {};
        });
    })
    .catch((e) => {
      console.error(e);
      return {};
    });

  return paymentMeans?.find((paymentMean) => paymentMean?.defaultPaymentMean) || ({} as Payment);
}

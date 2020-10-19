import { flatten, groupBy, minBy, sumBy } from 'lodash-es';
import { CatalogPricing, Pricing } from '@ovh-ux/manager-models';
import Commitment from './Commitment.class';
import { CATALOG_MAPPING } from './commitment.constants';

export default class CommitmentService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  getServiceAvailableEngagements(service) {
    return this.$q
      .all({
        serviceEngagement: this.getAvailableEngagement(service.serviceId),
        optionsEngagement: this.$q.all(
          service.options.map((option) =>
            this.getAvailableEngagement(option.serviceId),
          ),
        ),
      })
      .then(({ serviceEngagement, optionsEngagement }) => {
        const options = groupBy(flatten(optionsEngagement), 'pricingMode');
        return optionsEngagement.length
          ? serviceEngagement.map((commitment) => {
              options[commitment.pricingMode].map((option) =>
                commitment.addOptionCommitment(option),
              );
              return commitment;
            })
          : serviceEngagement;
      });
  }

  getAvailableEngagement(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/billing/engagement/available`)
      .then(({ data }) => data)
      .catch(() => [
        {
          price: {
            text: '110.99 €',
            value: 110.99,
            currencyCode: 'EUR',
          },
          pricingMode: 'periodic12',
          pricingType: 'rental',
          interval: 1,
          intervalUnit: 'month',
          engagement_configuration: {
            type: 'periodic',
            duration: 12,
            duration_unit: 'month',
          },
        },
        {
          price: {
            text: '105.99 €',
            value: 105.99,
            currencyCode: 'EUR',
          },
          pricingMode: 'periodic24',
          pricingType: 'rental',
          interval: 1,
          intervalUnit: 'month',
          engagement_configuration: {
            type: 'periodic',
            duration: 24,
            duration_unit: 'month',
          },
        },
        {
          price: {
            text: '1265.28 €',
            value: 1265.28,
            currencyCode: 'EUR',
          },
          pricingMode: 'upfront12',
          pricingType: 'rental',
          interval: 12,
          intervalUnit: 'month',
          engagement_configuration: {
            type: 'upfront',
            duration: 1,
            duration_unit: 'month',
          },
        },
        {
          price: {
            text: '1265.28 €',
            value: 1265.99,
            currencyCode: 'EUR',
          },
          pricingMode: 'upfront24',
          pricingType: 'rental',
          interval: 24,
          intervalUnit: 'month',
          engagement_configuration: {
            type: 'upfront',
            duration: 1,
            duration_unit: 'month',
          },
        },
      ])
      .then((commitments) => commitments.map((c) => new Commitment(c)));
  }

  commit(service, engagement, paymentMethod) {
    return this.$http
      .post(`/services/${service.serviceId}/billing/engagement/request`, {
        pricingMode: engagement.pricingMode,
      })
      .then(({ data }) => data)
      .then(({ order }) => {
        if (paymentMethod && order && order.url) {
          return this.payOrder(paymentMethod, order).catch(() => order);
        }

        return this.$q.when(order);
      });
  }

  payOrder(paymentMethod, order) {
    return this.$http
      .post(`/me/order/${order.orderId}/pay`, {
        data: {
          id: paymentMethod.paymentMethodId,
        },
      })
      .then(({ data }) => data);
  }

  getCatalogPrice(service, user) {
    return this.$http
      .get(`/order/catalog/public/${CATALOG_MAPPING[service.route.path]}`, {
        params: {
          ovhSubsidiary: user.ovhSubsidiary,
        },
      })
      .then(({ data }) => data)
      .then(({ plans, addons }) => {
        const currentPlan = plans.find(
          ({ planCode }) => planCode === service.planCode,
        );

        if (currentPlan) {
          const price = minBy(
            currentPlan.pricings
              .map((pricing) => new CatalogPricing(pricing))
              .filter((pricing) => pricing.includesRenew()),
            'duration',
          );
          const optionsPrices = service.options
            .map((option) =>
              addons.find(({ planCode }) => option.planCode === planCode),
            )
            .filter((options) => !!options)
            .map(({ pricings }) =>
              pricings.find(
                ({ capacities, mode }) =>
                  capacities.includes('renew') && mode === price.mode,
              ),
            );
          const totalPrice = price.price + sumBy(optionsPrices, 'price');
          const catalogPrice = new CatalogPricing({
            ...price,
            price: totalPrice,
          });

          return new Pricing({
            duration: 'P1M',
            price: {
              currencyCode: user.currency.code,
              value: catalogPrice.monthlyPrice,
            },
          });
        }

        return null;
      });
  }
}

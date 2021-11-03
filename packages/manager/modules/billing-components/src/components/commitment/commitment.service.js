import { flatten, groupBy, minBy, sumBy } from 'lodash-es';
import { CatalogPricing, Pricing } from '@ovh-ux/manager-models';
import { CATALOG_MAPPING } from './commitment.constants';

export default class CommitmentService {
  /* @ngInject */
  constructor($http, $q, coreConfig, BillingService) {
    this.$http = $http;
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.BillingService = BillingService;
  }

  getServiceAvailableEngagements(service) {
    return this.$q
      .all({
        serviceEngagement: this.BillingService.getAvailableEngagement(
          service.serviceId,
        ),
        optionsEngagement: this.$q.all(
          service.options.map((option) =>
            this.BillingService.getAvailableEngagement(option.serviceId),
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

  commit(service, engagement) {
    return this.$http
      .post(`/services/${service.serviceId}/billing/engagement/request`, {
        pricingMode: engagement.pricingMode,
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
          const renewPricings = currentPlan.pricings
            .map((pricing) => new CatalogPricing(pricing))
            .filter((pricing) => pricing.includesRenew());
          const defaultMonthlyPrice = renewPricings.find(
            (pricing) =>
              pricing.mode === 'default' && pricing.intervalUnit === 'month',
          );
          // return null if server does not have default monthly price
          if (!defaultMonthlyPrice) {
            return null;
          }
          const price = minBy(renewPricings, 'duration');
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

          return new Pricing(
            {
              duration: 'P1M',
              price: {
                currencyCode: user.currency.code,
                value: catalogPrice.monthlyPrice,
              },
            },
            this.coreConfig.getUserLocale(),
          );
        }

        return null;
      });
  }
}

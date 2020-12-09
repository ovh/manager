import filter from 'lodash/filter';
import head from 'lodash/head';
import map from 'lodash/map';

import {
  EMAIL_DOMAIN_MX_PLAN_MODELS,
  EMAIL_DOMAIN_OFFER_PREFIX,
  EMAIL_DOMAIN_UPGRADE_OPTION,
} from './upgrade.constants';

export default class EmailDomainService {
  /* @ngInject */
  constructor($q, $translate, OvhApiOrder) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiOrderEmailDomain = OvhApiOrder.Email().Domain().v6();
    this.OvhApiOrderSchema = OvhApiOrder.v6();
  }

  getOffers(domain) {
    return this.OvhApiOrderSchema.schema({
      rootPath: 'apiv6',
      cache: EMAIL_DOMAIN_MX_PLAN_MODELS,
    }).$promise.then((response) => {
      if (response && response.models) {
        const promises = map(
          response.models['email.domain.OfferEnum'].enum,
          (offer) =>
            this.getDurations(domain, offer)
              .then((durations) => ({
                name: offer,
                displayName: `${EMAIL_DOMAIN_OFFER_PREFIX} ${offer}`,
                duration: head(durations),
              }))
              .catch((error) => {
                // If offer is not available because it involves downgrading
                if (error.status === 403) {
                  return null;
                }

                return this.$q.reject(error);
              }),
        );

        return this.$q
          .all(promises)
          .then((offers) => filter(offers, (offer) => offer !== null));
      }
      return [];
    });
  }

  getDurations(domain, offer) {
    return this.OvhApiOrderEmailDomain.getOptions({
      domain,
      option: EMAIL_DOMAIN_UPGRADE_OPTION,
      offer,
    }).$promise.then((durations) => {
      const promises = map(durations, (duration) =>
        this.getPriceAndContracts(domain, offer, duration).then((details) => ({
          name: duration,
          prices: details.prices,
          contracts: details.contracts,
          details: details.details,
        })),
      );
      return this.$q.all(promises);
    });
  }

  getPriceAndContracts(domain, offer, duration) {
    return this.OvhApiOrderEmailDomain.getPricesAndContracts({
      domain,
      option: EMAIL_DOMAIN_UPGRADE_OPTION,
      offer,
      duration,
    }).$promise;
  }

  upgrade(domain, offer, duration) {
    return this.OvhApiOrderEmailDomain.orderEmail(
      {
        domain,
        option: EMAIL_DOMAIN_UPGRADE_OPTION,
        duration,
      },
      { offer },
    ).$promise;
  }
}

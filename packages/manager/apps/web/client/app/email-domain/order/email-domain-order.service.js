angular.module('services').service(
  'MXPlan',
  class MXPlan {
    /**
     * Constructor
     * @param $q
     * @param OvhHttp
     */
    constructor($q, OvhHttp) {
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    getOrderModels(domain) {
      return this.OvhHttp.get('/order.json', {
        rootPath: 'apiv6',
        cache: 'MX_PLAN_MODELS',
      }).then((response) => {
        if (response && response.models) {
          const promises = _.map(
            response.models['email.domain.OfferEnum'].enum,
            offer => this
              .orderDuration(domain, offer)
              .then(duration => this.orderPrice(domain, offer, duration)),
          );
          return this.$q.allSettled(promises);
        }
        return [];
      });
    }

    orderDuration(domain, offer) {
      return this.OvhHttp.get('/order/email/domain/new', {
        rootPath: 'apiv6',
        params: {
          domain,
          offer,
        },
      });
    }

    orderPrice(domain, offer, duration) {
      return this.OvhHttp.get(`/order/email/domain/new/${duration}`, {
        rootPath: 'apiv6',
        params: {
          domain,
          offer,
        },
      })
        .then(response => _.assign(response, { duration, offer }))
        .catch(err => this.$q.reject(err));
    }

    orderMxPlan(domain, offer, duration) {
      return this.OvhHttp.post(`/order/email/domain/new/${duration}`, {
        rootPath: 'apiv6',
        data: {
          domain,
          offer,
        },
      });
    }
  },
);

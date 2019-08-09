angular
  .module('App')
  .controller('DedicatedCloudDatacentersHostOrderCtrl', class {
    /* @ngInject */
    constructor(
      $q,
      $scope,
      $state,
      datacenterId,
      OvhHttp,
      serviceName,
      User,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.datacenterId = datacenterId;
      this.OvhHttp = OvhHttp;
      this.serviceName = serviceName;
      this.User = User;
    }

    $onInit() {
      this.user = null;
      this.selectedOffer = null;
      this.quantity = 1;
      this.expressOrderUrl = null;

      return this.fetchInitialData();
    }

    fetchInitialData() {
      this.loading = true;

      return this.$q
        .all({
          url: this.User.getUrlOf('express_order'),
          user: this.User.getUser(),
        })
        .then(({ url, user }) => {
          this.expressOrderUrl = url;
          this.user = user;
        })
        .catch((err) => {
          this.$scope.setMessage(this.$translate.instant('dedicatedCloud_tab_hosts_loading_error'), {
            message: err.message || err,
            type: 'ERROR',
          });
        })
        .finally(() => {
          this.loading = false;
        });
    }

    fetchOffers() {
      return this.OvhHttp
        .get('/order/cartServiceOption/privateCloud/{serviceName}', {
          rootPath: 'apiv6',
          urlParams: {
            serviceName: this.serviceName,
          },
        })
        .then((offers) => {
          const filtered = _.filter(offers, { family: 'host' });
          return filtered;
        })
        .then(offers => this.OvhHttp
          .get('/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/orderableHostProfiles', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: this.serviceName,
              datacenterId: this.datacenterId,
            },
          })
          .then((profiles) => {
            const result = [];

            angular.forEach(offers, (offer) => {
              const profile = _.filter(profiles, { name: offer.planCode });
              if (_.size(profile) === 1) {
                _.set(offer, 'profile', _.first(profile));
                result.push(offer);
              }
            });

            const sortedResult = _.sortBy(result, item => item.prices[0].price.value);
            this.selectedOffer = _.first(sortedResult);
            return sortedResult;
          }));
    }

    fetchDatagridOffers() {
      return this.fetchOffers()
        .then(offers => ({
          data: offers,
          meta: {
            totalCount: _.size(offers),
          },
        }));
    }

    getBackUrl() {
      return this.$state.href('app.dedicatedClouds.datacenter.hosts');
    }

    getOrderUrl() {
      const price = _.first(this.selectedOffer.prices);
      const normalizedQuantity = Math.floor(this.quantity);

      return `${this.expressOrderUrl}review?products=${JSURL.stringify([{
        productId: 'privateCloud',
        serviceName: this.serviceName,
        planCode: this.selectedOffer.planCode,
        duration: price.duration,
        pricingMode: price.pricingMode,
        quantity: normalizedQuantity,
        configuration: [{
          label: 'datacenter_id',
          values: [this.datacenterId],
        }],
      }])}`;
    }
  });

angular
  .module('App')
  .controller('ovhManagerPccDatacenterDatastoreOrder', class {
  /* @ngInject */
    constructor($q, $scope, $state, OvhHttp, User, serviceName, datacenterId) {
      this.$q = $q;
      this.$scope = $scope;
      this.$state = $state;
      this.OvhHttp = OvhHttp;
      this.User = User;
      this.serviceName = serviceName;
      this.datacenterId = datacenterId;

      this.user = null;
      this.selectedOffer = null;
      this.quantity = 1;
      this.expressOrderUrl = null;
    }

    fetchOffers() {
      return this.OvhHttp.get('/order/cartServiceOption/privateCloud/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: this.serviceName,
        },
      }).then((offers) => {
        const filtered = _.filter(offers, { family: 'datastore' });
        return filtered;
      }).then(offers => this.OvhHttp.get('/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/orderableFilerProfiles', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: this.serviceName,
          datacenterId: this.datacenterId,
        },
      }).then((profiles) => {
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
      return this.fetchOffers().then(offers => ({
        data: offers,
        meta: {
          totalCount: _.size(offers),
        },
      }));
    }

    getBackUrl() {
      return this.$state.href('app.dedicatedClouds.datacenter.datastores');
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

    $onInit() {
      this.loading = true;
      this.$q.all({
        url: this.User.getUrlOf('express_order'),
        user: this.User.getUser(),
      }).then(({ url, user }) => {
        this.expressOrderUrl = url;
        this.user = user;
      }).catch((err) => {
        this.$scope.setMessage(this.$translate.instant('dedicatedCloud_tab_datastores_loading_error'), {
          message: err.message || err,
          type: 'ERROR',
        });
      }).finally(() => {
        this.loading = false;
      });
    }
  });

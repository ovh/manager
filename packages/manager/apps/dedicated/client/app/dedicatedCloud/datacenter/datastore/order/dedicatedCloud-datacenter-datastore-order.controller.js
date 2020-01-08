import filter from 'lodash/filter';
import head from 'lodash/head';
import set from 'lodash/set';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';

angular.module('App').controller(
  'ovhManagerPccDatacenterDatastoreOrder',
  class {
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
      return this.OvhHttp.get(
        '/order/cartServiceOption/privateCloud/{serviceName}',
        {
          rootPath: 'apiv6',
          urlParams: {
            serviceName: this.serviceName,
          },
        },
      )
        .then((offers) => {
          const filtered = filter(offers, { family: 'datastore' });
          return filtered;
        })
        .then((offers) =>
          this.OvhHttp.get(
            '/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/orderableFilerProfiles',
            {
              rootPath: 'apiv6',
              urlParams: {
                serviceName: this.serviceName,
                datacenterId: this.datacenterId,
              },
            },
          ).then((profiles) => {
            const result = [];
            angular.forEach(offers, (offer) => {
              const profile = filter(profiles, { name: offer.planCode });
              if (size(profile) === 1) {
                set(offer, 'profile', head(profile));
                result.push(offer);
              }
            });
            const sortedResult = sortBy(
              result,
              (item) => item.prices[0].price.value,
            );
            this.selectedOffer = head(sortedResult);
            return sortedResult;
          }),
        );
    }

    fetchDatagridOffers() {
      return this.fetchOffers().then((offers) => ({
        data: offers,
        meta: {
          totalCount: size(offers),
        },
      }));
    }

    getBackUrl() {
      return this.$state.href('app.dedicatedClouds.datacenter.datastores');
    }

    getOrderUrl() {
      const price = head(this.selectedOffer.prices);
      const normalizedQuantity = Math.floor(this.quantity);

      return `${this.expressOrderUrl}review?products=${JSURL.stringify([
        {
          productId: 'privateCloud',
          serviceName: this.serviceName,
          planCode: this.selectedOffer.planCode,
          duration: price.duration,
          pricingMode: price.pricingMode,
          quantity: normalizedQuantity,
          configuration: [
            {
              label: 'datacenter_id',
              values: [this.datacenterId],
            },
          ],
        },
      ])}`;
    }

    $onInit() {
      this.loading = true;
      this.$q
        .all({
          url: this.User.getUrlOf('express_order'),
          user: this.User.getUser(),
        })
        .then(({ url, user }) => {
          this.expressOrderUrl = url;
          this.user = user;
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_tab_datastores_loading_error',
            ),
            {
              message: err.message || err,
              type: 'ERROR',
            },
          );
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
);

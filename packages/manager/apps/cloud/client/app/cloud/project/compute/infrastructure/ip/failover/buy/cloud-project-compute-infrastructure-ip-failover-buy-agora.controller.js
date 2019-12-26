import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import head from 'lodash/head';
import minBy from 'lodash/minBy';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureIpFailoverBuyAgoraCtrl',
    function CloudProjectComputeInfrastructureIpFailoverBuyAgoraCtrl(
      $http,
      $q,
      $stateParams,
      $translate,
      $uibModalInstance,
      $window,
      CucCloudMessage,
      OvhApiCloudProjectInstance,
    ) {
      const self = this;

      function getIpfoCatalog() {
        return $http
          .get('/order/catalog/formatted/ip', {
            serviceType: 'apiv6',
            params: {
              ovhSubsidiary: 'US',
            },
          })
          .then((result) => {
            if (result.status !== 200) {
              return $q.reject(result);
            }
            return filter(get(result, 'data.plans'), (offer) =>
              /failover/.test(offer.planCode),
            );
          });
      }

      function init() {
        self.loading = true;
        self.product = null;
        self.quantity = 1;
        self.country = null;
        self.instance = null;
        return $q
          .all({
            catalog: getIpfoCatalog(),
            instances: OvhApiCloudProjectInstance.v6().query({
              serviceName: $stateParams.projectId,
            }),
          })
          .then(({ catalog, instances }) => {
            self.instances = instances;

            self.catalog = catalog;
            self.product = head(catalog);
            self.country = head(self.getCountries(self.product));
            self.instance = head(self.instances);
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cpciif_buy_init_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            $uibModalInstance.dismiss();
            return $q.reject(err);
          })
          .finally(() => {
            self.loading = false;
          });
      }

      self.getPrice = (product) =>
        get(
          head(
            filter(
              get(product, 'details.pricings.default'),
              (p) => p.capacities.indexOf('installation') >= 0,
            ),
          ),
          'price',
        );

      self.getCountries = (product) =>
        get(
          find(get(product, 'details.product.configurations'), {
            name: 'country',
          }),
          'values',
        );

      self.getMaximumQuantity = (product) =>
        get(
          minBy(
            filter(
              get(product, 'details.pricings.default'),
              (p) => angular.isNumber(p.maximumQuantity),
              'maximumQuantity',
            ),
            'maximumQuantity',
          ),
          'maximumQuantity',
        );

      self.order = () => {
        const order = {
          planCode: self.product.planCode,
          productId: 'ip',
          pricingMode: 'default',
          quantity: self.quantity,
          configuration: [
            {
              label: 'country',
              value: self.country,
            },
            {
              label: 'destination',
              value: $stateParams.projectId,
            },
            {
              label: 'nexthop',
              value: self.instance.id,
            },
          ],
        };
        $window.open(
          `https://us.ovhcloud.com/order/express/#/express/review?products=${JSURL.stringify(
            [order],
          )}`,
          '_blank',
        );
        $uibModalInstance.dismiss();
      };

      self.cancel = $uibModalInstance.dismiss;

      init();
    },
  );

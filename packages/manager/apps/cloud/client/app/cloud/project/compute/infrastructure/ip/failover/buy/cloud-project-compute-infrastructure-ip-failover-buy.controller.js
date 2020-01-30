import defaults from 'lodash/defaults';
import filter from 'lodash/filter';
import find from 'lodash/find';
import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import isNaN from 'lodash/isNaN';
import isNumber from 'lodash/isNumber';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureIpFailoverBuyCtrl',
    function CloudProjectComputeInfrastructureIpFailoverBuyCtrl(
      $scope,
      $uibModalInstance,
      OvhApiIp,
      $translate,
      CucCloudMessage,
      OvhApiCloudProjectInstance,
      $stateParams,
      OvhApiOrderCloudProjectIp,
      OvhApiCloudProjectFlavor,
      OvhApiCloudProjectIpFailover,
      $window,
      $q,
      atInternet,
      OvhApiMe,
      CLOUD_GEOLOCALISATION,
      CLOUD_IPFO_ORDER_LIMIT,
    ) {
      const self = this;
      const { projectId } = $stateParams;

      function getBuyIpsInfo() {
        if (self.form.instance && self.form.country && self.form.quantity) {
          self.loaders.billingInfo = true;
          self.form.contractsAccepted = false;
          OvhApiOrderCloudProjectIp.v6()
            .get(
              {
                serviceName: projectId,
              },
              {
                country: self.form.country.toLowerCase(),
                instanceId: self.form.instance.id,
                quantity: self.form.quantity,
              },
            )
            .$promise.then(
              (result) => {
                self.datas.billingInfo = result;
              },
              (err) => {
                self.datas.billingInfo = null;
                CucCloudMessage.error(
                  [
                    $translate.instant('cpciif_buy_init_error'),
                    (err.data && err.data.message) || '',
                    self.form.instance.region,
                    self.form.country,
                  ].join(' '),
                );
                $uibModalInstance.dismiss();
              },
            )
            .finally(() => {
              self.loaders.billingInfo = false;
            });
        }
      }

      self.datas = {
        me: null,
        billingInfo: null,
      };

      self.form = {
        instances: [],
        flavors: [],
        failoverIps: [],
        instance: null,
        maxIp: 0,
        quantity: 1,
        quantityChanged() {
          self.datas.billingInfo = null;
          getBuyIpsInfo();
        },
        instanceChanged() {
          const instanceLoc = head(
            keys(
              pickBy(
                CLOUD_GEOLOCALISATION.instance,
                (region) => indexOf(region, self.form.instance.region) >= 0,
              ),
            ),
          );
          self.form.countryEnum = defaults(CLOUD_GEOLOCALISATION.ipfo, {
            instanceLoc: [],
          })[instanceLoc];
          self.datas.billingInfo = null;
          self.form.country = null;
        },
        country: null,
        countryEnum: null,
        countryChanged() {
          self.datas.billingInfo = null;
          getBuyIpsInfo();
        },
        contractsAccepted: false,
      };

      self.loaders = {
        init: false,
        billingInfo: false,
        buying: false,
      };

      $scope.countryTranslated = function countryTranslated(code) {
        return $translate.instant(`country_${code.toUpperCase()}`);
      };

      // ---------INIT---------

      function initInstance() {
        OvhApiCloudProjectInstance.v6().resetQueryCache();
        return OvhApiCloudProjectInstance.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then(
            (result) => {
              self.form.instances = result;
            },
            (err) => {
              self.form.instances = [];
              CucCloudMessage.error(
                [
                  $translate.instant('cpciif_buy_init_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              $uibModalInstance.dismiss();
              return $q.reject(err);
            },
          );
      }

      function initFlavors() {
        return OvhApiCloudProjectFlavor.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then(
            (result) => {
              self.form.flavors = result;
            },
            (err) => {
              self.form.flavors = [];
              CucCloudMessage.error(
                [
                  $translate.instant('cpciif_buy_init_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              $uibModalInstance.dismiss();
              return $q.reject(err);
            },
          );
      }

      function initIp() {
        OvhApiCloudProjectIpFailover.v6().resetQueryCache();
        return OvhApiCloudProjectIpFailover.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then(
            (result) => {
              self.form.failoverIps = result;
            },
            (err) => {
              self.form.failoverIps = [];
              CucCloudMessage.error(
                [
                  $translate.instant('cpciif_buy_init_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              $uibModalInstance.dismiss();
              return $q.reject(err);
            },
          );
      }

      function init() {
        const promises = [initInstance(), initFlavors(), initIp()];
        self.loaders.init = true;
        return $q
          .allSettled(promises)
          .then(() => {
            // compute the max limit of IP Failovers
            angular.forEach(self.form.instances, (instance) => {
              const flavor = head(
                filter(self.form.flavors, { id: instance.flavorId }),
              );
              if (flavor) {
                const limit = +CLOUD_IPFO_ORDER_LIMIT[flavor.type];
                if (!isNaN(limit) && isNumber(limit)) {
                  self.form.maxIp += limit;
                }
              }
            });

            // subtract current IP from limit
            const currentIps = filter(
              self.form.failoverIps,
              (ip) =>
                !ip.routedTo ||
                find(
                  self.form.instances,
                  (instance) => instance.id === ip.routedTo,
                ),
            );
            self.form.maxIp -= currentIps.length;

            // IP Failover must be attached to an ACTIVE instance
            self.form.instances = filter(self.form.instances, {
              status: 'ACTIVE',
            });

            // If no instance are available, disable buy IP
            if (self.form.instances.length === 0) {
              self.form.maxIp = 0;
            }
          })
          .finally(() => {
            self.loaders.init = false;
          });
      }

      // ---------MODAL---------

      function buyIps() {
        self.loaders.buying = true;

        OvhApiOrderCloudProjectIp.v6()
          .buy(
            {
              serviceName: projectId,
            },
            {
              country: self.form.country.toLowerCase(),
              instanceId: self.form.instance.id,
              quantity: self.form.quantity,
            },
          )
          .$promise.then(
            (result) => {
              $window.open(result.url, '_blank');
              CucCloudMessage.success(
                $translate.instant('cpciif_buy_success', { url: result.url }),
                { hideAfter: false },
              );
              $uibModalInstance.dismiss();
              atInternet.trackOrder({
                name: `[IP]ipfailover[ip-failover-${self.form.country}]`,
                page: 'iaas::pci-project::compute::infrastructure::order',
                priceTaxFree:
                  self.datas.billingInfo.prices.withoutTax.value /
                  self.form.quantity,
                quantity: self.form.quantity,
              });
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpciif_buy_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              $uibModalInstance.dismiss();
              return $q.reject(err);
            },
          )
          .finally(() => {
            self.loaders.buying = false;
          });
      }

      self.confirm = function confirm() {
        buyIps();
      };

      self.cancel = $uibModalInstance.dismiss;

      // ---------API CALLS---------

      init();
    },
  );

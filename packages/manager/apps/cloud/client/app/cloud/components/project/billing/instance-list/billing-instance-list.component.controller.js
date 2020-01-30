import find from 'lodash/find';
import map from 'lodash/map';

angular
  .module('managerApp')
  .controller(
    'BillingInstanceListComponentCtrl',
    function BillingInstanceListComponentCtrl(
      $q,
      $stateParams,
      $translate,
      CucPriceHelper,
      CucRegionService,
      OvhApiCloudProjectImage,
      OvhApiCloudProjectInstance,
      OvhApiMe,
      Toast,
    ) {
      const self = this;
      self.windowsStringPattern = '/^win-/';
      self.instanceConsumptionDetails = [];
      self.CucRegionService = CucRegionService;

      self.data = {
        instances: [],
        images: [],
        instanceToMonthlyPrice: null,
      };

      self.loaders = {
        monthlyBilling: false,
        instanceList: false,
      };

      self.currencySymbol = '';

      self.instanceToMonthly = null;

      function initInstances() {
        return OvhApiCloudProjectInstance.v6()
          .query({
            serviceName: $stateParams.projectId,
          })
          .$promise.then((instances) => {
            self.data.instances = instances;
          });
      }

      function initImages() {
        return OvhApiCloudProjectImage.v6()
          .query({
            serviceName: $stateParams.projectId,
          })
          .$promise.then((result) => {
            self.data.images = result;
          });
      }

      function initUserCurrency() {
        return OvhApiMe.v6()
          .get()
          .$promise.then((me) => {
            self.currencySymbol = me.currency.symbol;
          });
      }

      function getImageTypeFromReference(reference) {
        if (reference) {
          return /^win/.test(reference) ? 'windows' : 'linux';
        }
        return '';
      }

      function getInstanceConsumptionDetails(billingDetail) {
        const instanceConsumptionDetail = {};
        instanceConsumptionDetail.instanceId = billingDetail.instanceId;
        instanceConsumptionDetail.instanceName = billingDetail.instanceId;
        instanceConsumptionDetail.total = `${billingDetail.totalPrice.toFixed(
          2,
        )} ${self.currencySymbol}`;
        instanceConsumptionDetail.region = billingDetail.region;
        instanceConsumptionDetail.reference = billingDetail.reference;
        instanceConsumptionDetail.imageType = getImageTypeFromReference(
          billingDetail.reference,
        );
        instanceConsumptionDetail.vmType = billingDetail.reference
          ? billingDetail.reference
              .replace(self.windowsStringPattern, '')
              .toUpperCase()
          : '';

        const instance = find(self.data.instances, {
          id: billingDetail.instanceId,
        });
        if (instance) {
          instanceConsumptionDetail.isDeleted = false;
          instanceConsumptionDetail.instanceName = instance.name;
          instanceConsumptionDetail.monthlyBilling = instance.monthlyBilling;
          instanceConsumptionDetail.planCode = instance.planCode;
          const imageData = find(self.data.images, { id: instance.imageId });
          if (imageData) {
            instanceConsumptionDetail.imageType = imageData.type;
          }
        } else {
          instanceConsumptionDetail.isDeleted = true;
        }

        return instanceConsumptionDetail;
      }

      function loadConsumptionDetails() {
        self.instanceConsumptionDetailsInit = map(
          self.instances,
          (billingDetail) => getInstanceConsumptionDetails(billingDetail),
        );

        $q.allSettled(self.instanceConsumptionDetailsInit).then((instances) => {
          self.instanceConsumptionDetails = instances;
        });
      }

      self.$onInit = () => {
        self.loaders.instanceList = true;

        $q.all([initInstances(), initImages(), initUserCurrency()])
          .then(() => {
            loadConsumptionDetails();
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant('cpb_error_message'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loaders.instanceList = false;
          });
      };

      self.prepareMonthlyPaymentActivation = function prepareMonthlyPaymentActivation(
        instance,
      ) {
        self.instanceToMonthly = instance.instanceId;
        self.data.instanceToMonthlyPrice = null;
        self.loaders.monthlyBilling = true;

        CucPriceHelper.getPrices($stateParams.projectId)
          .then((prices) => {
            const monthlyPrice =
              prices[
                instance.planCode &&
                  instance.planCode.replace('consumption', 'monthly')
              ];
            if (!monthlyPrice) {
              self.endInstanceToMonthlyConversion();
              return $q.reject({
                data: { message: 'No monthly price for this instance' },
              });
            }
            self.data.instanceToMonthlyPrice = monthlyPrice;
            return $.when();
          })
          .catch((err) => {
            self.instanceToMonthly = null;
            Toast.error(
              [
                $translate.instant(
                  'cpbc_hourly_instance_pass_to_monthly_price_error',
                ),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loaders.monthlyBilling = false;
          });
      };

      self.confirmMonthlyPaymentActivation = function confirmMonthlyPaymentActivation() {
        self.loaders.monthlyBilling = true;

        OvhApiCloudProjectInstance.v6()
          .activeMonthlyBilling(
            {
              serviceName: $stateParams.projectId,
              instanceId: self.instanceToMonthly,
            },
            {},
          )
          .$promise.then(() => {
            // reset loaders and instance to activate
            self.endInstanceToMonthlyConversion();
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant(
                  'cpbc_hourly_instance_pass_to_monthly_error',
                ),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
            return $q.reject(err);
          })
          .finally(() => {
            self.loaders.monthlyBilling = false;
          });
      };

      self.endInstanceToMonthlyConversion = function endInstanceToMonthlyConversion() {
        self.instanceToMonthly = null;
      };
    },
  );

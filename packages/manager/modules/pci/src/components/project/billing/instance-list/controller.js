import find from 'lodash/find';
import map from 'lodash/map';
import { Environment } from '@ovh-ux/manager-config';

export default /* @ngInject */ function BillingInstanceListComponentCtrl(
  $q,
  $stateParams,
  $translate,
  DetailsPopoverService,
  OvhApiCloudProjectImage,
  OvhApiCloudProjectInstance,
  CucCloudMessage,
) {
  const self = this;
  self.windowsStringPattern = '/^win-/';
  self.instanceConsumptionDetails = [];

  self.data = {
    instances: [],
    images: [],
    instanceToMonthlyPrice: null,
  };

  self.loaders = {
    monthlyBilling: false,
    instanceList: false,
  };

  self.DetailsPopoverService = DetailsPopoverService;
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
    return $q.when(Environment.getUser()).then((me) => {
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
    instanceConsumptionDetail.total = `${billingDetail.totalPrice.toFixed(2)} ${
      self.currencySymbol
    }`;
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
    self.instanceConsumptionDetailsInit = map(self.instances, (billingDetail) =>
      getInstanceConsumptionDetails(billingDetail),
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
        CucCloudMessage.error(
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
}

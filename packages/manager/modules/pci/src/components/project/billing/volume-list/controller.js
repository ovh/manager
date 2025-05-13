import find from 'lodash/find';
import forEach from 'lodash/forEach';

export default /* @ngInject */ function(
  $q,
  $translate,
  $stateParams,
  coreConfig,
  CucCloudMessage,
  DetailsPopoverService,
  OvhApiCloudProjectVolume,
) {
  const self = this;
  self.DetailsPopoverService = DetailsPopoverService;
  self.volumeConsumptionDetails = [];
  self.currencySymbol = '';
  self.loading = false;
  self.data = {};

  function getVolumesDetails() {
    return OvhApiCloudProjectVolume.v6()
      .query({
        serviceName: $stateParams.projectId,
      })
      .$promise.then((volumes) => volumes);
  }

  function updateVolumeConsumptionDetails(
    allProjectVolumes,
    volumeConsumptions,
  ) {
    forEach(volumeConsumptions, (volumeConsumption) => {
      const volumeConsumptionDetail = {};
      volumeConsumptionDetail.totalPrice = `${volumeConsumption.totalPrice.toFixed(
        2,
      )} ${self.currencySymbol}`;
      volumeConsumptionDetail.volumeId = volumeConsumption.volumeId;
      volumeConsumptionDetail.quantity = volumeConsumption.quantity.value;
      volumeConsumptionDetail.region = volumeConsumption.region;
      volumeConsumptionDetail.type = volumeConsumption.type;

      volumeConsumptionDetail.amount = volumeConsumption.quantity.value;

      const volumeDetail = find(
        allProjectVolumes,
        (x) => x.id === volumeConsumption.volumeId,
      );
      if (volumeDetail) {
        volumeConsumptionDetail.name = volumeDetail.name;
        volumeConsumptionDetail.size = volumeDetail.size;
        volumeConsumptionDetail.status = volumeDetail.status;
      } else {
        volumeConsumptionDetail.name = volumeConsumption.volumeId;
        volumeConsumptionDetail.status = 'deleted';
      }

      self.volumeConsumptionDetails.push(volumeConsumptionDetail);
    });
  }

  function initVolumes() {
    return getVolumesDetails().then((allProjectVolumes) =>
      updateVolumeConsumptionDetails(allProjectVolumes, self.volumes),
    );
  }

  function initUserCurrency() {
    return $q.when(coreConfig.getUser()).then((me) => {
      self.currencySymbol = me.currency.symbol;
    });
  }

  self.$onInit = () => {
    self.loading = true;

    initUserCurrency()
      .then(() => initVolumes())
      .catch((err) => {
        CucCloudMessage.error(
          [
            $translate.instant('cpb_error_message'),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        $q.reject(err);
      })
      .finally(() => {
        self.loading = false;
      });
  };
}

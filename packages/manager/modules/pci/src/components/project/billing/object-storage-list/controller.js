export default /* @ngInject */ function(
  $q,
  $translate,
  coreConfig,
  CucCloudMessage,
  ovhManagerRegionService,
) {
  const self = this;
  self.ovhManagerRegionService = ovhManagerRegionService;

  self.currencySymbol = '';

  self.loading = false;

  function initUserCurrency() {
    return $q.when(coreConfig.getUser()).then((me) => {
      self.currencySymbol = me.currency.symbol;
    });
  }

  self.$onInit = () => {
    self.loading = true;

    $q.all([initUserCurrency()])
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
        self.loading = false;
      });
  };

  self.getStorageVolumeInfoTooltip = function getStorageVolumeInfoTooltip(
    storage,
  ) {
    return $translate
      .instant('cpbc_object_storage_consumption_info_part1')
      .concat(
        $translate.instant('cpbc_object_storage_consumption_info_part2', {
          amount: storage.stored ? storage.stored.quantity.value : 0,
        }),
      );
  };

  self.getStorageBandwidthInfoTooltip = function getStorageBandwidthInfoTooltip(
    storage,
  ) {
    return $translate
      .instant('cpbc_object_storage_output_traffic_info_part1')
      .concat(
        $translate.instant('cpbc_object_storage_output_traffic_info_part2', {
          amount: storage.outgoingBandwidth?.quantity?.value,
        }),
      );
  };
}

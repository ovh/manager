export default /* @ngInject */ function BillingArchiveStorageListComponentCtrl(
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
      .instant('cpbc_archive_storage_consumption_info_part1')
      .concat(
        $translate.instant('cpbc_archive_storage_consumption_info_part2', {
          amount: storage.stored ? storage.stored.quantity.value : 0,
        }),
      );
  };

  self.getStorageOutgoingBandwidthInfoTooltip = function getStorageOutgoingBandwidthInfoTooltip(
    storage,
  ) {
    return $translate
      .instant('cpbc_archive_storage_output_traffic_info_part1')
      .concat(
        $translate.instant('cpbc_archive_storage_output_traffic_info_part2', {
          amount: storage.outgoingBandwidth
            ? storage.outgoingBandwidth.quantity.value
            : 0,
        }),
      );
  };

  self.getStorageIncomingBandwidthInfoTooltip = function getStorageIncomingBandwidthInfoTooltip(
    storage,
  ) {
    return $translate
      .instant('cpbc_archive_storage_input_traffic_info_part1')
      .concat(
        $translate.instant('cpbc_archive_storage_input_traffic_info_part2', {
          amount: storage.incomingBandwidth
            ? storage.incomingBandwidth.quantity.value
            : 0,
        }),
      );
  };
}

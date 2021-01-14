import get from 'lodash/get';
import { Environment } from '@ovh-ux/manager-config';

export default /* @ngInject */ function(
  $q,
  $translate,
  CucCloudMessage,
  CucRegionService,
) {
  const self = this;

  self.CucRegionService = CucRegionService;

  self.currencySymbol = '';

  self.loading = false;

  function initUserCurrency() {
    return $q.when(Environment.getUser()).then((me) => {
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

  self.getSnapshotPriceInfoTooltip = function getSnapshotPriceInfoTooltip(
    snapshot,
  ) {
    return $translate.instant('cpbc_snapshot_col_usage_info_part1').concat(
      $translate.instant('cpbc_snapshot_col_usage_info_part2', {
        amount: get(snapshot, 'instance.quantity.value'),
      }),
    );
  };
}

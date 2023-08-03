import angular from 'angular';
import map from 'lodash/map';

export default /* @ngInject */ function(
  $translate,
  $q,
  $uibModalInstance,
  param,
  TucToast,
  TucToastError,
) {
  const self = this;

  function init() {
    self.type = null;
    self.helper = 'mobile';
    self.isLoading = false;

    self.disableOutgoing = param.disableOutgoing;
    self.config = {
      mobile: ['+336', '+337'],
      line: ['+331', '+332', '+333', '+334', '+335', '+339'],
      foreign: [
        '+1',
        '+2',
        '+30',
        '+31',
        '+32',
        '+34',
        '+35',
        '+36',
        '+37',
        '+38',
        '+39',
        '+4',
        '+5',
        '+6',
        '+7',
        '+8',
        '+9',
      ],
      special: ['+338'],
      short: ['10', '13', '14', '16', '30', '31', '32', '36', '39'],
    };
  }

  self.applyHelper = function applyHelper() {
    const toAdd = angular.copy(self.config[self.helper]);
    let nature = null;

    switch (self.helper) {
      case 'mobile':
      case 'line':
      case 'foreign':
      case 'special':
        nature = 'international';
        break;
      case 'short':
        nature = 'special';
        break;
      default:
        break;
    }

    self.isLoading = true;
    return $q
      .all(
        map(toAdd, (number) =>
          param.addScreenList({
            screen: {
              callNumber: number,
              nature,
              type: self.type,
            },
          }),
        ),
      )
      .then(() => {
        $uibModalInstance.close();
        TucToast.success(
          $translate.instant('telephony_calls_filtering_add_plural_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  };

  self.cancel = function cancel() {
    $uibModalInstance.dismiss();
  };

  init();
}

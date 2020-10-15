import filter from 'lodash/filter';
import get from 'lodash/get';
import isObject from 'lodash/isObject';

export default /* @ngInject */ function TelecomTelephonyLineCallsDisplayNumberCtrl(
  $q,
  $scope,
  $stateParams,
  $translate,
  $timeout,
  OvhApiTelephonyLineOptions,
  TucToast,
  TucToastError,
  tucTelephonyBulk,
) {
  const self = this;

  function getLineOptions() {
    return OvhApiTelephonyLineOptions.v6()
      .get({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then(
        (options) => {
          self.options = isObject(options) ? options : {};
          return options;
        },
        (error) => {
          // eslint-disable-next-line no-new
          new TucToastError(
            $translate.instant(
              'telephony_line_actions_line_calls_display_number_read_error',
            ),
          );
          return $q.reject(error);
        },
      );
  }

  function init() {
    self.isLoading = true;
    self.form = {
      identificationRestriction: undefined,
      displayedService: undefined,
    };

    $scope.$watch(
      'LineDisplayNumberCtrl.form.identificationRestriction',
      () => {
        if (self.form.identificationRestriction) {
          self.form.displayedService = angular.copy(self.displayedService);
        }
      },
    );

    return getLineOptions()
      .then((options) => {
        self.identificationRestriction = get(
          options,
          'identificationRestriction',
        );
        self.form.identificationRestriction = self.identificationRestriction;
        self.displayedService = options.displayNumber;
        self.form.displayedService = angular.copy(self.displayedService);
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  self.onChooseService = function onChooseService(service) {
    self.form.displayedService = service.serviceName;
  };

  self.hasChanges = function hasChanges() {
    return (
      !angular.equals(self.displayedService, self.form.displayedService) ||
      self.identificationRestriction !== self.form.identificationRestriction
    );
  };

  self.reset = function reset() {
    // $timeout is here so flat-checkbox is corretly refreshed ...
    $timeout(() => {
      self.form.displayedService = angular.copy(self.displayedService);
      self.form.identificationRestriction = self.identificationRestriction;
    });
  };

  self.update = function update() {
    const data = {
      identificationRestriction: self.form.identificationRestriction,
    };

    if (!data.identificationRestriction && self.form.displayedService) {
      data.displayNumber = self.form.displayedService;
    }

    self.isUpdating = true;
    return OvhApiTelephonyLineOptions.v6()
      .update(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        data,
      )
      .$promise.then(
        () => {
          self.identificationRestriction = self.form.identificationRestriction;
          self.displayedService = angular.copy(self.form.displayedService);
          TucToast.success(
            $translate.instant(
              'telephony_line_actions_line_calls_display_number_write_success',
            ),
          );
        },
        () =>
          new TucToastError(
            $translate.instant(
              'telephony_line_actions_line_calls_display_number_write_error',
            ),
          ),
      )
      .finally(() => {
        self.isUpdating = false;
      });
  };

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'displayNumber',
      actions: [
        {
          name: 'options',
          route: '/telephony/{billingAccount}/line/{serviceName}/options',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );
  };

  self.getBulkParams = function getBulkParams() {
    const data = {
      identificationRestriction: self.form.identificationRestriction,
    };

    if (!data.identificationRestriction && self.form.displayedService) {
      data.displayNumber = self.form.displayedService;
    }

    return data;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_actions_line_calls_display_number_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_actions_line_calls_display_number_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_actions_line_calls_display_number_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    OvhApiTelephonyLineOptions.resetCache();
    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_line_actions_line_calls_display_number_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}

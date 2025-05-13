import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import remove from 'lodash/remove';
import startsWith from 'lodash/startsWith';

export default /* @ngInject */ function TelecomTelephonyLineCallsExternalNumberCtrl(
  $scope,
  $q,
  $stateParams,
  $translate,
  $timeout,
  TelecomMediator,
  TelephonyMediator,
  OvhApiTelephony,
  TucToast,
  TucNumberPlans,
) {
  const self = this;
  let pollTimeout = null;

  self.loading = {
    init: false,
    add: false,
    remove: false,
  };

  self.model = {
    number: null,
    autoValidation: false,
  };

  self.line = null;
  self.isVip = false;
  self.toDelete = null;

  /* =============================
    =            HELPES            =
    ============================== */

  function fetchExternalDisplayedNumber() {
    return OvhApiTelephony.Trunk()
      .ExternalDisplayedNumber()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((numbers) =>
        $q
          .all(
            map(
              chunk(numbers, 50),
              (chunkNumbers) =>
                OvhApiTelephony.Trunk()
                  .ExternalDisplayedNumber()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    number: chunkNumbers,
                  }).$promise,
            ),
          )
          .then((chunkResult) => flatten(chunkResult)),
      )
      .then((resultParam) =>
        map(
          filter(resultParam, (number) => number.value !== null),
          'value',
        ),
      );
  }

  function resetModel() {
    self.model.number = null;
  }

  function startPolling() {
    pollTimeout = $timeout(
      () =>
        fetchExternalDisplayedNumber().then((numbers) => {
          self.list = numbers;
          startPolling();
        }),
      10000,
    );
  }

  function stopPolling() {
    if (pollTimeout) {
      $timeout.cancel(pollTimeout);
    }
  }

  self.checkSamePrefix = function checkSamePrefix(value) {
    if (!value) {
      return true;
    }
    return startsWith(
      value.replace('+', '00'),
      self.plan.prefix.replace('+', '00'),
    );
  };

  /* -----  End of HELPES  ------ */

  /* =============================
    =            EVENTS            =
    ============================== */

  self.onExternalNumberAddFormSubmit = function onExternalNumberAddFormSubmit() {
    let validationPromise = $q.when(true);
    self.validationCode = null;

    self.loading.add = true;

    return OvhApiTelephony.Trunk()
      .ExternalDisplayedNumber()
      .v6()
      .save(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        self.model,
      )
      .$promise.then((externalNumber) => {
        self.list.push(externalNumber);
        if (!self.model.autoValidation) {
          validationPromise = OvhApiTelephony.Trunk()
            .ExternalDisplayedNumber()
            .v6()
            .validate(
              {
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                number: externalNumber.number,
              },
              {},
            )
            .$promise.then((response) => {
              self.validationCode = response.validationCode;
            });
        }

        // reset model
        resetModel();

        // launch validation if needed
        return validationPromise.then(() => {
          if (self.list.length === 1) {
            startPolling();
          }
          $timeout(() => {
            self.externalNumberAddForm.number.$setValidity('required', true);
          }, 50);
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_trunk_external_number_add_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.add = false;
      });
  };

  self.onCancelBtnClick = function onCancelBtnClick() {
    resetModel();
  };

  self.onConfirmDeleteNumberBtnClick = function onConfirmDeleteNumberBtnClick() {
    self.loading.remove = true;

    return OvhApiTelephony.Trunk()
      .ExternalDisplayedNumber()
      .v6()
      .remove({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        number: self.toDelete.number,
      })
      .$promise.then(() => {
        remove(self.list, (number) => number.number === self.toDelete.number);
        TucToast.success(
          $translate.instant('telephony_trunk_external_number_delete_success'),
        );
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_trunk_external_number_delete_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.toDelete = null;
        self.validationCode = null;
        self.loading.remove = false;
      });
  };

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.line = group.getLine($stateParams.serviceName);
        self.plan = TucNumberPlans.getPlanByNumber(self.line);
        self.isVip = TelecomMediator.isVip;
        self.model.autoValidation = self.isVip;

        return fetchExternalDisplayedNumber().then((numbers) => {
          self.list = numbers;

          if (self.list.length > 0) {
            startPolling();
          }
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_trunk_external_number_load_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  $scope.$on('$destroy', () => {
    stopPolling();
  });

  /* -----  End of INITIALIZATION  ------ */
}

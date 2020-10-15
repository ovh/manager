import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyLineMgcpIpRestrictionCtrl(
  $q,
  $stateParams,
  $translate,
  TucIpAddress,
  OvhApiTelephony,
  OvhApiMe,
  TucToast,
  TucToastError,
  tucTelephonyBulk,
) {
  const self = this;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function fetchPhone() {
    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .get({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  }

  function fetchDefaultMgcpIpRestriction() {
    return OvhApiMe.Telephony()
      .DefaultIpRestriction()
      .v6()
      .query()
      .$promise.then((ids) =>
        $q.all(
          ids.map(
            (id) =>
              OvhApiMe.Telephony()
                .DefaultIpRestriction()
                .v6()
                .get({
                  id,
                }).$promise,
          ),
        ),
      )
      .then((ips) => find(ips, { type: 'mgcp' }));
  }

  self.ipValidator = (function ipValidator() {
    return {
      test(value) {
        return TucIpAddress.isValidPublicIp4(value);
      },
    };
  })();

  self.hasMgcpIpRestrictionChanged = function hasMgcpIpRestrictionChanged() {
    return !angular.equals(
      self.mgcpIpRestrictionForm.mgcpIpRestriction,
      self.mgcpIpRestriction.mgcpIpRestriction,
    );
  };

  self.hasMgcpDefaultIpRestrictionChanged = function hasMgcpDefaultIpRestrictionChanged() {
    return !angular.equals(
      self.mgcpDefaultIpRestriction,
      self.mgcpDefaultIpRestrictionForm,
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.setMgcpIpRestriction = function setMgcpIpRestriction() {
    self.isChangingMgcpIpRestriction = true;
    return OvhApiTelephony.Line()
      .Phone()
      .v6()
      .edit(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          mgcpIpRestriction: self.mgcpIpRestrictionForm.mgcpIpRestriction
            ? self.mgcpIpRestrictionForm.mgcpIpRestriction
            : null,
        },
      )
      .$promise.then(() => {
        TucToast.success(
          $translate.instant('telephony_line_mgcp_ip_restriction_edit_success'),
        );
        return fetchPhone().then((phone) => {
          self.mgcpIpRestriction = pick(phone, 'mgcpIpRestriction');
          self.mgcpIpRestrictionForm = angular.copy(self.mgcpIpRestriction);
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_mgcp_ip_restriction_edit_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.isChangingMgcpIpRestriction = false;
      });
  };

  self.setMgcpDefaultIpRestriction = function setMgcpDefaultIpRestriction() {
    self.isChangingMgcpDefaultIpRestriction = true;
    let promise = $q.when();
    let subnet = get(self.mgcpDefaultIpRestrictionForm, 'subnet');
    subnet = subnet.indexOf('/') >= 0 ? subnet : `${subnet}/32`;
    if (isEmpty(self.mgcpDefaultIpRestriction)) {
      promise = OvhApiMe.Telephony()
        .DefaultIpRestriction()
        .v6()
        .create({
          subnet,
          type: 'mgcp',
        }).$promise;
    } else {
      promise = OvhApiMe.Telephony()
        .DefaultIpRestriction()
        .v6()
        .remove({
          id: get(self.mgcpDefaultIpRestriction, 'id'),
        })
        .$promise.then(() => {
          if (!isEmpty(subnet)) {
            return OvhApiMe.Telephony()
              .DefaultIpRestriction()
              .v6()
              .create({
                subnet,
                type: 'mgcp',
              }).$promise;
          }
          return null;
        });
    }
    return promise
      .then(() => {
        TucToast.success(
          $translate.instant('telephony_line_mgcp_ip_restriction_edit_success'),
        );
        return fetchDefaultMgcpIpRestriction().then(
          (defaultMgcpIpRestriction) => {
            self.mgcpDefaultIpRestriction = defaultMgcpIpRestriction;
            self.mgcpDefaultIpRestrictionForm = angular.copy(
              self.mgcpDefaultIpRestriction,
            );
          },
        );
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_mgcp_ip_restriction_edit_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.isChangingMgcpDefaultIpRestriction = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.isLoading = true;
    return $q
      .all({
        phone: fetchPhone(),
        defaultMgcpIpRestriction: fetchDefaultMgcpIpRestriction(),
      })
      .then((result) => {
        self.mgcpIpRestriction = pick(result.phone, 'mgcpIpRestriction');
        self.mgcpIpRestrictionForm = angular.copy(self.mgcpIpRestriction);
        self.mgcpDefaultIpRestriction = result.defaultMgcpIpRestriction;
        self.mgcpDefaultIpRestrictionForm = angular.copy(
          self.mgcpDefaultIpRestriction,
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'phone',
      actions: [
        {
          name: 'phone',
          route: '/telephony/{billingAccount}/line/{serviceName}/phone',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) => ['mgcp'].indexOf(service.featureType) > -1,
    );
  };

  self.getBulkParams = function getBulkParams() {
    return {
      mgcpIpRestriction: self.mgcpIpRestrictionForm.mgcpIpRestriction || null,
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_mgcp_ip_restriction_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_mgcp_ip_restriction_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_mgcp_ip_restriction_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    OvhApiTelephony.Line()
      .Phone()
      .v6()
      .resetAllCache();

    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_line_mgcp_ip_restriction_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  init();
}

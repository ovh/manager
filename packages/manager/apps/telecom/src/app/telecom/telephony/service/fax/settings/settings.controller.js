import assignWith from 'lodash/assignWith';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import pull from 'lodash/pull';

export default /* @ngInject */ function TelecomTelephonyServiceFaxSettingsCtrl(
  $q,
  $stateParams,
  $translate,
  $timeout,
  OvhApiTelephony,
  TucToast,
  TucToastError,
  tucTelephonyBulk,
) {
  const self = this;

  /* ===============================
  =            HELPERS            =
  =============================== */

  function fetchEnums() {
    return OvhApiTelephony.v6()
      .schema({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((schema) => ({
        quality: schema.models['telephony.FaxQualityEnum'].enum,
        sendingTries: schema.models['telephony.FaxSendingTries'].enum,
        mailFormat: schema.models['telephony.FaxMailFormatEnum'].enum,
      }));
  }

  function fetchSettings() {
    return OvhApiTelephony.Fax()
      .v6()
      .getSettings({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  }

  function refreshSettings() {
    OvhApiTelephony.Fax()
      .v6()
      .resetCache();
    OvhApiTelephony.Fax()
      .v6()
      .resetQueryCache();
    return fetchSettings().then((settings) =>
      assignWith(
        self.settings,
        pick(settings, [
          'faxQuality',
          'faxMaxCall',
          'faxTagLine',
          'fromName',
          'fromEmail',
          'mailFormat',
          'redirectionEmail',
        ]),
        (objectValue, sourceValue) =>
          isArray(sourceValue) ? sourceValue : sourceValue.toString(),
      ),
    );
  }

  /* -----  End of HELPERS  ------ */

  /* ===============================
    =            ACTIONS            =
    =============================== */

  self.cancelAddAddressesToNotifyForm = function cancelAddAddressesToNotifyForm() {
    self.addressesToNotifyForm.email = null;
    self.addressesToNotifyForm.isShown = false;
  };

  self.addRedirectionEmail = function addRedirectionEmail(email) {
    self.settings.redirectionEmail.push(email);
    self.addressesToNotifyForm.redirectionEmail = null;
    self.addressesToNotifyForm.isShown = false;
  };

  self.removeRedirectionEmail = function removeRedirectionEmail(email) {
    pull(self.settings.redirectionEmail, email);
  };

  self.updateAllSettings = function updateAllSettings() {
    self.updatingSettings = true;

    return OvhApiTelephony.Fax()
      .v6()
      .setSettings(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        self.settings,
      )
      .$promise.then(() => refreshSettings())
      .then(() => {
        TucToast.success(
          $translate.instant(
            'telephony_service_fax_settings_notification_settings_update_settings_success',
          ),
        );
      })
      .catch(() => {
        TucToast.error(
          $translate.instant(
            'telephony_service_fax_settings_notification_settings_update_settings_error',
          ),
        );
      })
      .finally(() => {
        self.updatingSettings = false;
      });
  };

  /* -----  End of ACTIONS  ------ */

  /* ======================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading = {
      init: true,
    };

    self.enums = {};
    self.settings = {};

    self.addressesToNotifyForm = {
      email: null,
      threshold: 5,
      isShown: false,
      isAdding: false,
      isRemoving: false,
    };

    self.newRedirectionEmail = null;

    return $q
      .all({
        enums: fetchEnums(),
        settings: refreshSettings(),
      })
      .then((results) => {
        self.enums = results.enums;
      })
      .catch((err) => {
        self.settings = null;
        return new TucToastError(err);
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'faxSettings',
      actions: [
        {
          name: 'settings',
          route: '/telephony/{billingAccount}/fax/{serviceName}/settings',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) => ['fax', 'voicefax'].indexOf(service.featureType) > -1,
    );
  };

  self.getBulkParams = function getBulkParams() {
    return self.settings;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_service_fax_settings_update_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_service_fax_settings_update_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_service_fax_settings_update_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_service_fax_settings_update_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}

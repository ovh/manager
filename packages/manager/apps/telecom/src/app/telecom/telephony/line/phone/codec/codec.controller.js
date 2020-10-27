import endsWith from 'lodash/endsWith';
import every from 'lodash/every';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import some from 'lodash/some';
import trim from 'lodash/trim';

export default /* @ngInject */ function TelecomTelephonyLinePhoneCodecCtrl(
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
  OvhApiTelephony,
  tucTelephonyBulk,
  tucVoipLinePhone,
) {
  const self = this;
  let codecsAuto = null;

  self.loading = {
    init: false,
  };

  self.model = {
    codecs: null,
  };

  self.codecs = null;
  self.servicesWithPhone = [];
  self.isCheckingPhones = false;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function refreshCodecs() {
    if (self.line.options.codecs) {
      self.model.codecs = find(self.line.availableCodecs, {
        value: trim(self.line.options.codecs, '_a'),
      });

      codecsAuto = endsWith(self.line.options.codecs, '_a');

      self.codecs = angular.extend(
        {
          isAutomaticActivated: endsWith(self.line.options.codecs, '_a'),
        },
        find(self.line.availableCodecs, {
          value: self.line.options.codecs.replace('_a', ''),
        }),
      );

      self.model.auto = self.codecs.isAutomaticActivated;
    }
  }

  self.isAutomaticCodecEnabled = function isAutomaticCodecEnabled() {
    return every(self.line.availableCodecs, {
      automatic: true,
    });
  };

  self.hasChanged = function hasChanged() {
    return (
      (self.model.codecs && self.codecs.value !== self.model.codecs.value) ||
      self.model.auto !== codecsAuto
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.saveNewCodec = function saveNewCodec() {
    self.loading.save = true;

    return self.line
      .saveOption(
        'codecs',
        self.model.auto
          ? `${self.model.codecs.value}_a`
          : self.model.codecs.value,
      )
      .then(
        () => {
          self.saved = true;
          TucToast.success([
            $translate.instant(
              'telephony_line_phone_codec_edit_codec_save_success',
            ),
          ]);
          refreshCodecs();
        },
        (error) => {
          if (error.init) {
            TucToast.error(
              [
                $translate.instant(
                  'telephony_line_phone_codec_edit_codec_load_error',
                ),
                (error.data && error.data.message) || '',
              ].join(' '),
            );
          } else {
            TucToast.error(
              [
                $translate.instant(
                  'telephony_line_phone_codec_edit_codec_save_error',
                ),
                (error.data && error.data.message) || '',
              ].join(' '),
            );
          }
        },
      )
      .finally(() => {
        self.loading.save = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.line = group.getLine($stateParams.serviceName);

        return $q
          .all({
            options: self.line.getOptions(),
            codecList: self.line.getAvailableCodecs(),
          })
          .then(refreshCodecs);
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_phone_codec_load_error'),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return error;
      })
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'codecs',
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
    const filteredServices = filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );

    return tucVoipLinePhone.fetchAll().then((voipLinePhones) =>
      filter(filteredServices, (service) =>
        some(voipLinePhones, {
          serviceName: service.serviceName,
          billingAccount: service.billingAccount,
        }),
      ),
    );
  };

  self.getBulkParams = function getBulkParams() {
    const data = {
      codecs: self.model.auto
        ? `${self.model.codecs.value}_a`
        : self.model.codecs.value,
    };

    return data;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_phone_codec_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_phone_codec_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant('telephony_line_phone_codec_bulk_error'),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    OvhApiTelephony.Line()
      .Options()
      .resetCache();
    TelephonyMediator.resetAllCache();
    TelephonyMediator.init();

    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_line_phone_codec_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}

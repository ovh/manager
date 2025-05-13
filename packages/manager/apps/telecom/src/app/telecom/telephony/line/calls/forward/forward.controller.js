import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyLineCallsForwardCtrl(
  $http,
  $q,
  $stateParams,
  $translate,
  $state,
  TucToast,
  TelecomTelephonyLineCallsForwardService,
  tucValidator,
  tucTelephonyBulk,
) {
  const self = this;
  self.validator = tucValidator;

  function getEnabledTypes(types) {
    return map(filter(types, { enable: true }), 'id');
  }

  /**
   * Save the current forwards
   * @return {Promise}
   */
  self.save = function save() {
    self.loading.save = true;
    return TelecomTelephonyLineCallsForwardService.saveForwards(
      $stateParams.billingAccount,
      $stateParams.serviceName,
      self.forwards,
    )
      .finally(() => {
        self.loading.save = false;
      })
      .then(
        () => {
          TucToast.success(
            $translate.instant(
              'telephony_line_actions_line_calls_forward_save_success',
            ),
          );
          self.saved = angular.copy(self.forwards);
        },
        (err) => {
          TucToast.error(
            $translate.instant(
              'telephony_line_actions_line_calls_forward_save_error',
            ),
          );
          return $q.reject(err);
        },
      )
      .finally(() => {
        self.loading.save = false;
      });
  };

  /**
   * Check if it could be a phone number
   * @param  {[type]} num [description]
   * @return {[type]}     [description]
   */
  self.seemsPhoneNumber = function seemsPhoneNumber(num, forward) {
    if (forward.enable) {
      return /^00[\d\s]*$|^\+\d[\d\s]*$/.test(num);
    }
    return true;
  };

  /**
   * Cancel modifications
   */
  self.cancel = function cancel() {
    self.setCancelBuffer(true);
  };

  self.toggleChecked = function toggleChecked(forward) {
    forEach(self.forwards, (fwd) => {
      if (forward.type === 'Unconditional') {
        if (fwd.type !== forward.type) {
          set(fwd, 'enable', false);
        }
      } else if (fwd.type === 'Unconditional') {
        set(fwd, 'enable', false);
      }
      return false;
    });
  };

  /**
   * Do we need to save ?
   * @return {Bool}
   */
  self.needSave = function needSave() {
    let toSave = false;
    forEach(self.forwards, (forward) => {
      const saved = find(self.saved, { type: forward.type });
      if (!saved || saved.footPrint !== forward.footPrint) {
        toSave = true;
      }
    });
    return toSave;
  };

  /**
   * Make a save of the current data
   */
  self.setCancelBuffer = function setCancelBuffer(restore) {
    if (restore) {
      self.forwards = angular.copy(self.saved);
      forEach(self.forwards, (forward) => {
        set(
          forward,
          'nature',
          find(self.lineOptionForwardNatureTypeEnum, {
            value: forward.nature.value,
          }),
        );
        set(
          forward,
          'number',
          find(self.allOvhNumbers, {
            type: forward.number.type,
            serviceName: forward.number.serviceName,
          }),
        );
      });
    } else {
      self.saved = angular.copy(self.forwards);
    }
    self.masterForward = find(self.forwards, { master: true });
  };

  /**
   * get the cancellation of the data
   * @return {Object} saved data
   */
  self.getCancelBuffer = function getCancelBuffer() {
    return self.saved;
  };

  /**
   * Load all fowards
   * @return {Promise}
   */
  function loadForwards() {
    return TelecomTelephonyLineCallsForwardService.loadForwards(
      $stateParams.billingAccount,
      $stateParams.serviceName,
      self.lineOptionForwardNatureTypeEnum,
      self.allOvhNumbers,
    ).then(
      (forwards) => {
        self.forwards = forwards;
        self.autocompleteLines = forwards.reduce(
          (autocomplete, forward) => ({
            ...autocomplete,
            [forward.type]: [],
          }),
          {},
        );
        self.setCancelBuffer();
      },
      (err) => {
        TucToast.error(
          $translate.instant(
            'telephony_line_actions_line_calls_forward_options_load_error',
          ),
        );
        return $q.reject(err);
      },
    );
  }

  /**
   * Load all possible forward natures
   * @return {Promise}
   */
  function loadNatures() {
    return TelecomTelephonyLineCallsForwardService.loadNatures().then(
      (natures) => {
        self.lineOptionForwardNatureTypeEnum = natures;
      },
      () => {
        TucToast.error(
          $translate.instant(
            'telephony_line_actions_line_calls_forward_schema_load_error',
          ),
        );
        return $q.reject();
      },
    );
  }

  function extractNatureFromForward(forward) {
    const nature = get(forward.nature, 'value', null);

    return nature === 'external' ? 'number' : nature;
  }

  function extractNumberFromForward(forward) {
    const number =
      get(forward.nature, 'value', null) === 'external'
        ? get(forward.externalNumber, 'serviceName', null)
        : get(forward.number, 'serviceName', null);

    return number || get(forward.number, 'serviceName', null);
  }

  function init() {
    self.loading = {
      init: true,
    };
    self.options = {
      lockOutCallPassword: null,
      lockOutCall: null,
    };

    self.listBillingAccounts = [];

    self.types = [
      { id: 'number', label: 'Alias', enable: true },
      { id: 'fax', label: 'Fax', enable: true },
      { id: 'voicemail', label: 'SIP', enable: true },
      { id: 'plug&phone', label: 'Plug&Phone', enable: true },
    ];

    self.filter = {
      billingAccount: '',
      types: getEnabledTypes(self.types),
    };

    self.saved = angular.copy(self.options);
    return loadNatures()
      .then(loadForwards)
      .finally(() => {
        self.loading.init = false;
      });
  }

  self.onNumberChange = (forward) => {
    if (forward.number.serviceName.length < 5) {
      return $q.resolve([]);
    }

    return $http
      .get('/telephony/searchServices', {
        params: {
          axiom: forward.number.serviceName,
        },
      })
      .then(({ data: lines }) => {
        self.autocompleteLines[forward.type] = lines.filter(({ type }) =>
          forward.nature.topologies.includes(type),
        );
      });
  };

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'forward',
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
    const data = {};
    const forwardBackup = find(self.forwards, { type: 'Backup' });
    const forwardBusy = find(self.forwards, { type: 'Busy' });
    const forwardNoReply = find(self.forwards, { type: 'NoReply' });
    const forwardUnconditional = find(self.forwards, {
      type: 'Unconditional',
    });

    if (forwardBackup) {
      data.forwardBackup = forwardBackup.enable;
      data.forwardBackupNature = extractNatureFromForward(forwardBackup);
      data.forwardBackupNumber = extractNumberFromForward(forwardBackup);
    }

    if (forwardBusy) {
      data.forwardBusy = forwardBusy.enable;
      data.forwardBusyNature = extractNatureFromForward(forwardBusy);
      data.forwardBusyNumber = extractNumberFromForward(forwardBusy);
    }

    if (forwardNoReply) {
      data.forwardNoReplyDelay = forwardNoReply.delay;
      data.forwardNoReply = forwardNoReply.enable;
      data.forwardNoReplyNature = extractNatureFromForward(forwardNoReply);
      data.forwardNoReplyNumber = extractNumberFromForward(forwardNoReply);
    }

    if (forwardUnconditional) {
      data.forwardUnconditional = forwardUnconditional.enable;
      data.forwardUnconditionalNature = extractNatureFromForward(
        forwardUnconditional,
      );
      data.forwardUnconditionalNumber = extractNumberFromForward(
        forwardUnconditional,
      );
    }

    return data;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_actions_line_calls_forward_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_actions_line_calls_forward_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_actions_line_calls_forward_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });
    self.save();

    // reset initial values to be able to modify again the options
    TelecomTelephonyLineCallsForwardService.resetAllCache();
    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_line_actions_line_calls_forward_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}

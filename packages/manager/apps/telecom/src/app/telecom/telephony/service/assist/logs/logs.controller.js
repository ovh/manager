import filter from 'lodash/filter';
import get from 'lodash/get';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyServiceAssistLogsCtrl(
  $q,
  $translate,
  $state,
  $stateParams,
  tucVoipService,
  tucVoipLineFeature,
  OvhApiMe,
  TucToast,
  PAGINATION_PER_PAGE,
  tucTelephonyBulk,
) {
  const self = this;

  self.service = null;
  self.logs = null;
  self.logsPerPage = PAGINATION_PER_PAGE;

  // notifications edit
  self.edition = {
    active: false,
    notifications: null,
  };

  // logs
  self.availableDayInterval = [
    'today',
    'yesterday',
    '2 days ago',
    '3 days ago',
  ];
  self.availableLogsFrequencies = ['Never', 'Twice a day', 'Once a day'];

  self.loading = {
    init: false,
    refresh: false,
    user: false,
    save: false,
  };

  self.model = {
    dayInterval: self.availableDayInterval[0],
  };
  self.user = null;

  /* =============================
  =            EVENTS            =
  ============================== */

  /**
   *  Refresh service logs.
   */
  self.onLogsFrequencySelectChange = function onLogsFrequencySelectChange() {
    self.loading.refresh = true;

    return tucVoipService
      .fetchServiceDiagnosticReports(self.service, self.model.dayInterval)
      .then((logs) => {
        self.logs = logs;
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_line_assist_support_logs_refresh_error',
            ),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.refresh = false;
      });
  };

  /* ----------  NOTIFICATIONS EDITION  ---------- */

  /**
   *  Start edition of the feature notifications.
   */
  self.onStartEditBtnClick = function onStartEditBtnClick() {
    // copy notifications from fetched feature
    self.edition.notifications = angular.copy(
      self.service.feature.notifications,
    );

    // start edition mode
    self.edition.mode = true;

    // fetch user if not already done
    if (!self.user && !self.edition.notifications.logs.email) {
      self.loading.user = true;

      // if request fail - no need to catch it
      OvhApiMe.v6()
        .get()
        .$promise.then((user) => {
          self.user = user;
          self.edition.notifications.logs.email = self.user.email;
        })
        .finally(() => {
          self.loading.user = false;
        });
    } else if (!self.edition.notifications.logs.email) {
      self.edition.notifications.logs.email = self.user.email;
    }
  };

  /**
   *  Cancel all the modifications made to feature notifications.
   */
  self.onCancelEditionBtnClick = function onCancelEditionBtnClick() {
    self.edition.notifications = null;
    self.edition.mode = false;
  };

  /**
   *  Launch the feature notifications save.
   */
  self.onNotificationsEditFormSubmit = function onNotificationsEditFormSubmit() {
    self.loading.save = true;

    // reset email and sendIfNull if frequency is "Never"
    if (self.edition.notifications.logs.frequency === 'Never') {
      self.edition.notifications.logs.email = null;
      self.edition.notifications.logs.sendIfNull = false;
    }

    // save notifications
    return tucVoipLineFeature
      .saveFeature(self.service.feature, {
        notifications: self.edition.notifications,
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_assist_support_logs_save_error'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.save = false;
        self.edition.mode = false;
        self.edition.notifications = null;
      });
  };

  /* -----  End of EVENTS  ------ */

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return tucVoipService
      .fetchSingleService($stateParams.billingAccount, $stateParams.serviceName)
      .then((service) => {
        self.service = service;
        self.bulkDatas.billingAccount = self.service.billingAccount;
        self.bulkDatas.serviceName = self.service.serviceName;
        self.type = self.service.featureType === 'fax' ? 'fax' : 'line';

        return $q.all({
          feature: tucVoipLineFeature.fetchFeature(service),
          logs: self.onLogsFrequencySelectChange(),
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_line_assist_support_logs_init_error'),
            get(error, 'data.message', ''),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* -----  End of INITIALIZATION  ------*/

  self.bulkDatas = {
    infos: {
      name: 'assistLogs',
      actions: [
        {
          name: 'assistLogs',
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
    self.bulkDatas.infos.actions[0].route = `/telephony/{billingAccount}/${self.type}/{serviceName}`;
    const logs = self.edition.mode
      ? self.edition.notifications.logs
      : self.service.feature.notifications.logs;

    return {
      notifications: {
        logs: pick(logs, ['frequency', 'sendIfNull', 'email']),
      },
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_assist_support_logs_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_assist_support_logs_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_assist_support_logs_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    self.$onInit();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_line_assist_support_logs_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };
}

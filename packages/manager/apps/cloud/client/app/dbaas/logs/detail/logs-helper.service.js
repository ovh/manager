import get from 'lodash/get';

class LogsHelperService {
  constructor($translate, $state, OvhApiDbaas, CucServiceHelper,
    CucCloudPoll, CucControllerModalHelper, LogsConstants, ovhDocUrl, URLS) {
    this.$translate = $translate;
    this.$state = $state;
    this.CucServiceHelper = CucServiceHelper;
    this.CucCloudPoll = CucCloudPoll;
    this.CucControllerModalHelper = CucControllerModalHelper;
    this.LogsConstants = LogsConstants;
    this.OperationApiService = OvhApiDbaas.Logs().Operation().v6();
    this.ovhDocUrl = ovhDocUrl;
    this.URLS = URLS;
    this.initGuides();
  }

  killPoller() {
    if (this.poller) {
      this.poller.kill();
    }
  }

  /**
   * Polls operation API untill it returns success or failure
   *
   * @param {any} errorMessage, message to show on UI
   * @param {any} error, the error object
   * @param {any} messageData, the data to be used in the error message
   * @memberof LogsHelperService
   */
  pollOperation(serviceName, operation) {
    this.killPoller();
    return this.CucCloudPoll.poll({
      item: operation,
      pollFunction: (opn) => this.OperationApiService
        .get({ serviceName, operationId: opn.operationId }).$promise,
      stopCondition: (opn) => opn.state === this.LogsConstants.FAILURE
        || opn.state === this.LogsConstants.SUCCESS || opn.state === this.LogsConstants.REVOKED,
    });
  }

  /**
   * handles error state for create, delete and update input
   *
   * @param {any} errorMessage, message to show on UI
   * @param {any} error, the error object
   * @param {any} messageData, the data to be used in the error message
   * @memberof LogsHelperService
   */
  handleError(errorMessage, error, messageData) {
    return this.CucServiceHelper.errorHandler({
      textToTranslate: errorMessage,
      translateParams: messageData,
    })(error);
  }

  /**
   * handles (CRUD) operations create, delete and update.
   * Repetedly polls for operation untill it returns SUCCESS, FAILURE or REVOKED message.
   *
   * @param {any} serviceName
   * @param {any} operation, operation to poll
   * @param {any} successMessage, message to show on UI
   * @param {any} messageData, the data to be used in the success message
   * @returns promise which will be resolved to operation object
   * @memberof LogsHelperService
   */
  handleOperation(serviceName, operation, successMessage, messageData) {
    return this.pollOperation(serviceName, operation)
      .$promise
      .then((pollResult) => {
        if (get(pollResult, '[0].item.state') !== this.LogsConstants.SUCCESS) {
          const error = { data: { message: 'Operation failed' } };
          return Promise.reject(error);
        }
        if (successMessage) {
          this.CucServiceHelper.successHandler(successMessage)(messageData);
        }
        return pollResult;
      });
  }

  /**
   * shows offer upgrade required info modal
   * @param {string} serviceName
   */
  showOfferUpgradeModal(serviceName) {
    return this.CucControllerModalHelper.showInfoModal({
      titleText: this.$translate.instant('options_upgradequotalink_increase_quota_title'),
      text: this.$translate.instant('options_upgradequotalink_increase_quota_message'),
      okButtonText: this.$translate.instant('options_upgradequotalink_increase_quota_upgrade'),
    })
      .then(() => this.$state.go('dbaas.logs.detail.offer', { serviceName }));
  }

  /**
   * creates guide menu object having LDP and OVH guide links
   */
  initGuides() {
    this.guides = {};
    this.guides.title = this.$translate.instant('logs_guides');
    this.guides.list = [{
      name: this.$translate.instant('logs_guides_title'),
      url: this.ovhDocUrl.getDocUrl(this.LogsConstants.LOGS_DOCS_NAME),
      external: true,
    }];
    this.guides.footer = {
      name: this.$translate.instant('logs_guides_footer'),
      url: this.URLS.guides.home.FR,
      external: true,
    };
  }

  getGuides() {
    return this.guides;
  }

  /**
   * return true if account is of type basic, false otherwise
   * @param {accountDetails} account
   */
  isBasicOffer(account) {
    return !account.offer.reference.startsWith(this.LogsConstants.LOGS_PRO);
  }

  isAccountDisabled(account) {
    return account.state === this.LogsConstants.SERVICE_STATE_DISABLED;
  }

  accountSetupRequired(account) {
    return account.state === this.LogsConstants.SERVICE_STATE_TO_CONFIG;
  }
}

angular.module('managerApp').service('LogsHelperService', LogsHelperService);

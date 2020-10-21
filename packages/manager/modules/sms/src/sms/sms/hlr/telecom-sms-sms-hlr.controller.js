import assign from 'lodash/assign';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';
import trimStart from 'lodash/trimStart';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $q,
    $translate,
    goBack,
    OvhApiSms,
    TucSmsMediator,
    tucValidator,
    TucToast,
    TucToastError,
    SMS_URL,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$translate = $translate;
    this.api = {
      sms: {
        hlr: OvhApiSms.Hlr().v6(),
      },
    };
    this.goBack = goBack;
    this.TucSmsMediator = TucSmsMediator;
    this.validator = tucValidator;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.constant = { SMS_URL };
  }

  $onInit() {
    this.hlr = {
      data: null,
      isSending: false,
    };
    this.service = null;

    this.refreshHlr();
  }

  /**
   * Fetch mobile or landline phone operator.
   * @param  {Object} hlr
   * @return {Promise}
   */
  fetchPhoneOperator(hlr) {
    return this.api.sms.hlr.getOperator({
      serviceName: this.$stateParams.serviceName,
      id: hlr.id,
    }).$promise;
  }

  /** @TODO removed when api returns the Terms Of Use (CGU) * */
  /**
   * Get HLR terms of use.
   * @return {String}
   */
  getHlrTermsOfUse() {
    return this.constant.SMS_URL.hlrTermsOfUse;
  }

  refreshHlr() {
    this.hlr.data = null;
    this.api.sms.hlr.resetCache();
    this.api.sms.hlr.resetQueryCache();
    return this.TucSmsMediator.initDeferred.promise
      .then(() =>
        this.api.sms.hlr
          .query({
            serviceName: this.$stateParams.serviceName,
          })
          .$promise.then((hlrIds) =>
            hlrIds.sort((a, b) => b - a).map((id) => ({ id })),
          )
          .then((hlrs) => {
            this.hlr.data = hlrs;
            this.service = this.TucSmsMediator.getCurrentSmsService();
          }),
      )
      .catch((err) => {
        this.TucToastError(err);
      });
  }

  /**
   * Get details.
   * @param  {Object} hlr item
   * @return {Promise}
   */
  getDetails(item) {
    if (item.transformed) {
      return this.$q((resolve) => resolve(item));
    }
    return this.api.sms.hlr
      .get({
        serviceName: this.$stateParams.serviceName,
        id: item.id,
      })
      .$promise.then((hlr) => {
        set(hlr, 'transformed', true);
        return hlr;
      })
      .then((hlr) =>
        this.fetchPhoneOperator(hlr)
          .then((operator) => assign(hlr, { operatorName: operator.operator }))
          .catch(() => hlr),
      );
  }

  /**
   * Send a HLR query.
   * @return {Promise}
   */
  send() {
    this.hlr.isSending = true;
    return this.api.sms.hlr
      .send(
        {
          serviceName: this.$stateParams.serviceName,
        },
        {
          receivers: [this.receiver],
        },
      )
      .$promise.then(() => {
        this.service.creditsLeft -= 0.1;
        this.TucToast.success(
          this.$translate.instant('sms_sms_hlr_query_send_success'),
        );
        return this.refreshHlr();
      })
      .catch(() => {
        this.TucToast.error(
          this.$translate.instant('sms_sms_hlr_query_send_failed'),
        );
      })
      .finally(() => {
        this.hlr.isSending = false;
      });
  }

  /**
   * Format receiver number.
   * @param  {String} number
   * @return {String}
   */
  static formatReceiverNumber(number) {
    if (number) {
      if (startsWith(number, '00')) {
        return `+${trimStart(number, '00')}`;
      }
      if (number.charAt(0) === '0') {
        return `+33${number.slice(1)}`;
      }
    }
    return number;
  }

  /**
   * Compute receiver.
   */
  computeReceiver() {
    this.receiver = this.constructor.formatReceiverNumber(this.receiver);
  }

  /**
   * Restrict input.
   */
  restrictInput() {
    if (this.receiver) {
      this.receiver = this.receiver.replace(/[^0-9+]/g, '');
    }
  }
}

import angular from 'angular';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import union from 'lodash/union';
import uniqBy from 'lodash/uniqBy';

export default class {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $stateParams,
    $translate,
    $state,
    $timeout,
    OvhApiSms,
    TucToast,
    TucToastError,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$state = $state;
    this.$timeout = $timeout;
    this.api = {
      sms: OvhApiSms.v6(),
      smsSenders: OvhApiSms.Senders().v6(),
    };
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      init: false,
      adding: false,
    };
    this.senders = {
      pattern: /^[\w\s\-.,&+]+$/,
      availableForValidation: {
        domains: [],
        nichandle: [],
        selected: {},
      },
    };
    this.sendersAvailableForValidation = null;
    this.choice = 'manual';

    this.loading.init = true;
    return this.$q
      .all({
        senders: this.fetchSenders(),
        sendersAvailableForValidation: this.fetchSendersAvailableForValidation(),
      })
      .then((results) => {
        this.sendersAvailableForValidation =
          results.sendersAvailableForValidation;
        return this.$q.all(
          map(
            results.senders,
            (sender) =>
              this.api.smsSenders.get({
                serviceName: this.$stateParams.serviceName,
                sender,
              }).$promise,
          ),
        );
      })
      .then((senders) => {
        this.senders.availableForValidation.domains = filter(
          this.sendersAvailableForValidation,
          { referer: 'domain' },
        );
        this.senders.availableForValidation.domains = filter(
          this.senders.availableForValidation.domains,
          (domain) =>
            !find(senders, {
              sender: domain.sender,
            }),
        );
        this.senders.availableForValidation.nichandle = uniqBy(
          filter(this.sendersAvailableForValidation, { referer: 'nichandle' }),
          'sender',
        );
        this.senders.availableForValidation.nichandle = filter(
          this.senders.availableForValidation.nichandle,
          (nichandle) =>
            !find(senders, {
              sender: nichandle.sender,
            }),
        );
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Fetch all senders.
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.smsSenders.query({
      serviceName: this.$stateParams.serviceName,
    }).$promise;
  }

  /**
   * Fetch all senders available for validation.
   * @return {Promise}
   */
  fetchSendersAvailableForValidation() {
    return this.api.sms.getSendersAvailableForValidation({
      serviceName: this.$stateParams.serviceName,
    }).$promise;
  }

  /**
   * Add sender available.
   * @param {Object} sender
   */
  addSenderAvailable(sender) {
    this.loading.adding = true;
    return this.api.smsSenders
      .create(
        {
          serviceName: this.$stateParams.serviceName,
        },
        {
          sender: sender.sender,
          reason: 'sendersAvailableForValidation',
        },
      )
      .$promise.then(() => {
        this.TucToast.success(
          this.$translate.instant('sms_senders_add_sender_added'),
        );
        return this.$state.go('sms.service.senders');
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.adding = false;
      });
  }

  /**
   * Add sender.
   * @return {Promise}
   */
  add() {
    this.loading.adding = true;
    return this.api.smsSenders
      .create(
        {
          serviceName: this.$stateParams.serviceName,
        },
        {
          sender: this.sender.sender,
          description: this.sender.description,
          reason: this.sender.reason,
        },
      )
      .$promise.then(() =>
        this.sender.supportingDocument !== undefined
          ? this.addSupportingDocument(
              this.sender.sender,
              this.sender.supportingDocument[0],
            )
          : this.$q.when(),
      )
      .then(() =>
        this.$state.go('sms.service.senders').then(() => {
          this.TucToast.success(
            this.$translate.instant('sms_senders_add_warning'),
          );
        }),
      )
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.adding = false;
      });
  }

  addSupportingDocument(senderName, supportingDocument) {
    const { name } = supportingDocument;
    return this.$http
      .post(
        `/sms/${this.$stateParams.serviceName}/senders/${senderName}/documents`,
        {
          name,
        },
      )
      .then(({ data }) => this.$http.put(data.putUrl, supportingDocument));
  }

  /**
   * Get all selected senders.
   * @return {Array}
   */
  getSelection() {
    const allSelectedSenders = union(
      this.senders.availableForValidation.nichandle,
      this.senders.availableForValidation.domains,
    );
    return filter(
      allSelectedSenders,
      (sender) =>
        this.senders.availableForValidation.selected &&
        this.senders.availableForValidation.selected[sender.sender],
    );
  }

  /**
   * Add all selected senders available for validaton.
   * @return {Promise}
   */
  addSelectedSendersAvailableForValidaton() {
    const sendersAvailableForValidaton = this.getSelection();
    const queries = sendersAvailableForValidaton.map(
      (sender) =>
        this.api.smsSenders.create(
          {
            serviceName: this.$stateParams.serviceName,
          },
          {
            sender: sender.sender,
            reason: 'sendersAvailableForValidation',
          },
        ).$promise,
    );
    this.loading.adding = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.TucToast.info(
      this.$translate.instant('sms_senders_add_senders_success'),
    );
    return this.$q
      .all(queries)
      .then(() => {
        this.senders.availableForValidation.selected = {};
        return this.$state.go('sms.service.senders');
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.adding = false;
      });
  }
}

import _ from 'lodash';

import addPhonebookController from './addPhonebookContact/telecom-sms-sms-compose-addPhonebookContact.controller';
import addPhonebookTemplate from './addPhonebookContact/telecom-sms-sms-compose-addPhonebookContact.html';
import receiversListController from './addReceiversLists/telecom-sms-sms-compose-addReceiversLists.controller';
import receiversListTemplate from './addReceiversLists/telecom-sms-sms-compose-addReceiversLists.html';
import tipsController from './tips/telecom-sms-sms-compose-tips.controller';
import tipsComposeTemplate from './tips/telecom-sms-sms-compose-tips-compose.html';
import tipsSizeTemplate from './tips/telecom-sms-sms-compose-tips-size.html';

export default class {
  /* @ngInject */
  constructor(
    $q, $translate, $stateParams, $filter, $uibModal,
    OvhApiSms, TucSmsMediator, OvhApiMe, atInternet, TucToast, TucToastError, SMS_URL,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.$uibModal = $uibModal;
    this.TucSmsMediator = TucSmsMediator;
    this.api = {
      sms: {
        jobs: OvhApiSms.Jobs().v6(),
        phonebooks: OvhApiSms.Phonebooks().v6(),
        receivers: OvhApiSms.Receivers().v6(),
        senders: OvhApiSms.Senders().v6(),
        virtualNumbers: {
          jobs: OvhApiSms.VirtualNumbers().Jobs().v6(),
        },
      },
      user: OvhApiMe.v6(),
    };
    this.atInternet = atInternet;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
    this.SMS_URL = SMS_URL;
  }

  $onInit() {
    this.loading = {
      init: false,
      send: false,
    };
    this.enums = {};
    this.user = {};
    this.senders = {
      raw: [],
      alphanumeric: [],
      other: [],
      virtual: [],
    };
    this.receivers = {
      raw: [],
      count: 0,
      records: 0,
    };
    this.phonebooks = {
      raw: [],
      current: null,
      lists: [],
    };
    this.service = null;
    this.message = {
      coding: '7bit',
      defaultSize: 160,
      remainingCharacters: null,
      equivalence: null, // number of SMS that will be sent
      maxlength: null,
      maxLengthReached: false,
    };
    this.sms = {
      class: 'phoneDisplay',
      differedPeriod: false,
      message: null,
      noStopClause: false,
      receivers: null,
      sender: 'shortNumber',
      senderForResponse: false,
    };
    this.advice = false;
    this.moreOptions = false;
    this.picker = {
      date: null,
      dateOpened: false,
      time: moment().toDate(),
      options: {
        minDate: moment().toDate(),
      },
    };
    this.urls = {
      receivers: _.get(this.SMS_URL, 'guides.receivers'),
    };

    this.loading.init = true;
    return this.TucSmsMediator.initDeferred.promise.then(() => this.$q.all({
      enums: this.fetchEnums(),
      user: this.fetchUser(),
      senders: this.fetchSenders(),
      receivers: this.fetchReceivers(),
      phonebooks: this.fetchPhonebooks(),
    }).then((result) => {
      this.enums = result.enums;
      this.user = result.user;
      this.senders.raw = result.senders;
      this.receivers.raw = result.receivers;
      this.phonebooks.raw = result.phonebooks;
      this.phonebooks.current = _.head(this.phonebooks.raw);
      return this.senders.raw;
    }).then(senders => _.each(senders, (sender) => {
      if (sender.type === 'virtual') {
        this.senders.virtual.push(sender);
      } else if (/\d+/.test(sender.sender)) {
        this.senders.other.push(sender);
      } else {
        this.senders.alphanumeric.push(sender);
      }
    })).then(() => {
      this.service = this.TucSmsMediator.getCurrentSmsService();
      this.computeRemainingChar();
    })).catch((err) => {
      this.TucToastError(err);
    }).finally(() => {
      this.loading.init = false;
    });
  }

  /**
   * Fetch enums.
   * @return {Promise}
   */
  fetchEnums() {
    return this.TucSmsMediator.getApiScheme().then((schema) => {
      const smsClass = {
        smsClass: _.pull(schema.models['sms.ClassEnum'].enum, 'toolkit'),
      };
      return smsClass;
    });
  }

  /**
   * Fetch user.
   * @return {Promise}
   */
  fetchUser() {
    return this.api.user.get().$promise;
  }

  /**
   * Fetch senders
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.sms.senders
      .query({
        serviceName: this.$stateParams.serviceName,
      }).$promise
      .then(sendersIds => this.$q
        .all(_.map(sendersIds, sender => this.api.sms.senders.get({
          serviceName: this.$stateParams.serviceName,
          sender,
        }).$promise))
        .then(senders => _.filter(senders, { status: 'enable' })));
  }

  /**
   * Fetch receivers.
   * @return {Promise}
   */
  fetchReceivers() {
    return this.api.sms.receivers
      .query({
        serviceName: this.$stateParams.serviceName,
      }).$promise
      .then(receiversIds => this.$q
        .all(_.map(receiversIds, slotId => this.api.sms.receivers.get({
          serviceName: this.$stateParams.serviceName,
          slotId,
        }).$promise)));
  }

  /**
   * Fetch phonebooks.
   * @return {Promise}
   */
  fetchPhonebooks() {
    return this.api.sms.phonebooks
      .query({
        serviceName: this.$stateParams.serviceName,
      }).$promise
      .then(phonebooksIds => this.$q
        .all(_.map(phonebooksIds, bookKey => this.api.sms.phonebooks.get({
          serviceName: this.$stateParams.serviceName,
          bookKey,
        }).$promise)).then(phonebooks => _.sortBy(phonebooks, 'name')));
  }

  /**
   * Compute remaining characters.
   * @return {Object}
   */
  computeRemainingChar() {
    return _.assign(this.message, this.TucSmsMediator.getSmsInfoText(
      this.sms.message,
      !this.sms.noStopClause, // suffix
    ));
  }

  /**
   * Is virtual number.
   * @return {Boolean}
   */
  isVirtualNumber() {
    return !!_.find(this.senders.virtual, { sender: this.sms.sender });
  }

  /**
   * Show advice.
   * @return {Object}
   */
  showAdvice() {
    if (this.sms.sender && /[0-9+]/.test(this.sms.sender) && !this.isVirtualNumber()) {
      this.advice = true;
      this.sms.noStopClause = true;
    } else {
      this.advice = false;
      this.sms.noStopClause = false;
    }
    return this.computeRemainingChar();
  }

  /**
   * Open date picker.
   * @param  {Object} $event
   */
  openDatePicker($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.picker.dateOpened = true;
  }

  /**
   * Get differed period helper.
   * @return {String|Null}
   */
  getDifferedPeriod() {
    const date = new Date();
    if (this.picker.date) {
      this.picker.date.setHours(this.picker.time.getHours());
      this.picker.date.setMinutes(this.picker.time.getMinutes());
      if (this.picker.date > date) {
        const minutes = moment(this.picker.date).diff(moment(), 'minutes');
        return minutes;
      }
    }
    return null;
  }

  /* eslint-disable max-len */
  /**
   * Create sms.
   * @param  {String} slotId
   * @return {Object}
   */
  createSms(slotId) {
    const phonebookContactNumber = [];
    _.each(this.phonebooks.lists, contact => phonebookContactNumber.push(_.get(contact, contact.type)));
    const receivers = _.union(phonebookContactNumber, this.sms.receivers ? [this.sms.receivers] : null);
    const differedPeriod = this.sms.differedPeriod ? this.getDifferedPeriod() : null;
    const sender = this.sms.sender === 'shortNumber' ? null : this.sms.sender;
    const senderForResponse = this.sms.sender === 'shortNumber' ? true : this.sms.senderForResponse;
    return {
      charset: 'UTF-8',
      class: this.sms.class,
      coding: this.message.coding,
      differedPeriod,
      message: this.sms.message,
      noStopClause: !!this.sms.noStopClause,
      priority: 'high',
      receivers,
      receiversSlotId: slotId || null,
      sender,
      senderForResponse,
      validityPeriod: '2880',
    };
  }
  /* eslint-enable max-len */

  /**
   * Reset form helper.
   * @param {Object} form
   */
  resetForm(form) {
    // restore default values
    this.sms = {
      class: 'phoneDisplay',
      differedPeriod: false,
      message: null,
      receivers: null,
      noStopClause: false,
      sender: 'shortNumber',
      senderForResponse: false,
    };
    this.computeRemainingChar();
    this.clearReceiversLists();
    this.clearPhonebookContactList();

    // hide the options panel
    this.moreOptions = false;
    form.$setPristine(true);
    form.$setUntouched(true);
  }

  /**
   * Get estimation credit remaining helper.
   * @return {String}
   */
  getEstimationCreditRemaining() {
    const totalReceivers = this.receivers.records
      + this.phonebooks.lists.length + (this.sms.receivers ? 1 : 0);
    const creditRemaining = this.service.creditsLeft
      - (totalReceivers * this.message.equivalence);
    return this.$filter('number')(creditRemaining, 2);
  }

  /**
   * Clear receivers' lists.
   * @param  {Object} $event
   * @return {Array}
   */
  clearReceiversLists($event) {
    if ($event) {
      $event.preventDefault();
    }
    this.receivers.records = 0;
    this.receivers.count = 0;
    return _.map(this.receivers.raw, receiver => _.set(receiver, 'isSelected', false));
  }

  /**
   * Opens a modal to add receivers' lists.
   * @param {Object} $event
   */
  addReceiversLists($event) {
    $event.preventDefault();
    const modal = this.$uibModal.open({
      animation: true,
      template: receiversListTemplate,
      controller: receiversListController,
      controllerAs: 'AddReceiversListsCtrl',
      resolve: {
        receivers: () => this.receivers.raw,
      },
    });
    modal.result.then((receivers) => {
      this.receivers = {
        raw: receivers,
        count: _.size(_.filter(receivers, 'isSelected')),
        records: _.sum(_.pluck(_.filter(receivers, 'isSelected'), 'records')),
      };
    });
  }

  /**
   * Opens a modal to add phonebook contact.
   * @param {Object} $event
   */
  addPhonebookContact($event) {
    $event.preventDefault();
    const modal = this.$uibModal.open({
      animation: true,
      template: addPhonebookTemplate,
      controller: addPhonebookController,
      controllerAs: 'AddPhonebookContactCtrl',
      resolve: { phonebooks: () => this.phonebooks },
    });
    modal.result.then((result) => {
      this.phonebooks.lists = [];
      _.each(result, contact => this.phonebooks.lists.push(contact));
    });
  }

  /**
   * Clear phonebook contact list helper.
   * @param  {Object} $event
   * @return {Object}
   */
  clearPhonebookContactList($event) {
    if ($event) {
      $event.preventDefault();
    }
    this.phonebooks.lists = [];
    return this.phonebooks;
  }

  /**
   * Send SMS.
   * @param  {Object} form
   * @return {Promise}
   */
  send(form) {
    const promises = [];
    const slotIds = _.pluck(_.filter(this.receivers.raw, 'isSelected'), 'slotId');
    this.loading.send = true;
    if (this.isVirtualNumber()) {
      if (this.sms.receivers || _.size(this.phonebooks.lists)) {
        promises.push(this.api.sms.virtualNumbers.jobs.send({
          serviceName: this.$stateParams.serviceName,
          number: this.sms.sender,
        }, _.omit(this.createSms(), [
          'sender',
          'noStopClause',
          'senderForResponse',
        ])).$promise);
      }
      if (_.size(slotIds)) {
        _.map(slotIds, slotId => promises.push(this.api.sms.virtualNumbers.jobs.send({
          serviceName: this.$stateParams.serviceName,
          number: this.sms.sender,
        }, _.omit(this.createSms(slotId), [
          'receivers',
          'sender',
          'noStopClause',
          'senderForResponse',
        ])).$promise));
      }
    } else {
      if (this.sms.receivers || _.size(this.phonebooks.lists)) {
        promises.push(this.api.sms.jobs.send({
          serviceName: this.$stateParams.serviceName,
        }, this.createSms()).$promise);
      }
      if (_.size(slotIds)) {
        _.map(slotIds, slotId => promises.push(this.api.sms.jobs.send({
          serviceName: this.$stateParams.serviceName,
        }, _.omit(this.createSms(slotId), 'receivers')).$promise));
      }
    }

    return this.$q.all(promises).then((results) => {
      const totalCreditsRemoved = _.sum(results, 'totalCreditsRemoved');
      const invalidReceivers = _.chain(results).pluck('invalidReceivers').flatten().value();
      const validReceivers = _.chain(results).pluck('validReceivers').flatten().value();

      // update the creditLeft value (displayed on the dashboard)
      this.service.creditsLeft -= totalCreditsRemoved;
      this.atInternet.trackClick({
        name: 'sms-sended',
        type: 'action',
        chapter1: 'telecom-sms',
        chapter2: 'telecom-sms-sms',
        chapter3: 'telecom-sms-sms-compose',
        customObject: {
          nichandle: _.get(this.user, 'nichandle'),
          country: _.get(this.user, 'country'),
          receiversCount: this.receivers.count,
          receiversLists: this.receivers.records + (this.sms.receivers ? 1 : 0),
          phonebookContactCount: this.phonebooks.lists.length,
          totalCreditsRemoved,
          invalidReceivers: _.size(invalidReceivers),
          validReceivers: _.size(validReceivers),
        },
      });
      this.resetForm(form);
      this.TucToast.success(this.$translate.instant('sms_sms_compose_status_success'));
    }).catch((err) => {
      this.TucToast.error(this.$translate.instant('sms_sms_compose_status_failed'));
      return this.$q.reject(err);
    }).finally(() => {
      this.loading.send = false;
    });
  }

  /**
   * Cancel.
   * @param  {Object} form
   */
  cancel(form) {
    this.resetForm(form);
  }

  /**
   * Opens a modal with tips.
   * @param  {Object} $event
   * @param  {String} tip
   */
  tips($event, tip) {
    $event.preventDefault();
    $event.stopPropagation();
    switch (tip) {
      case 'size':
        this.$uibModal.open({
          template: tipsSizeTemplate,
          controller: tipsController,
          controllerAs: 'ComposeTipsCtrl',
        });
        break;
      case 'compose':
        this.$uibModal.open({
          template: tipsComposeTemplate,
          controller: tipsController,
          controllerAs: 'ComposeTipsCtrl',
        });
        break;
      default:
        break;
    }
  }
}

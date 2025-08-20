import angular from 'angular';
import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';
import trimStart from 'lodash/trimStart';

import editController from './edit/telecom-sms-senders-edit.controller';
import editTemplate from './edit/telecom-sms-senders-edit.html';
import removeController from './remove/telecom-sms-senders-remove.controller';
import removeTemplate from './remove/telecom-sms-senders-remove.html';
import terminateController from './terminate/telecom-sms-senders-terminate.controller';
import terminateTemplate from './terminate/telecom-sms-senders-terminate.html';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $q,
    $filter,
    $timeout,
    $uibModal,
    $translate,
    OvhApiSms,
    TucToast,
    TucToastError,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.api = {
      sms: {
        senders: OvhApiSms.Senders().v6(),
        virtualNumbers: OvhApiSms.VirtualNumbers().v6(),
      },
    };
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.senders = {
      raw: [],
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'sender',
      orderDesc: false,
      isLoading: false,
      isDeleting: false,
      hasExpiration: false,
    };
    this.refresh();
  }

  /**
   * Refresh senders' list.
   * @return {Promise}
   */
  refresh() {
    this.senders.isLoading = true;
    this.resetAllCache();
    return this.fetchSenders()
      .then((senders) =>
        this.$q
          .all(
            map(senders, (sender) => {
              set(sender, 'serviceInfos', null);
              if (['virtual', 'time2chat'].includes(sender.type)) {
                const number = `00${trimStart(sender.sender, '+')}`;
                return this.api.sms.virtualNumbers
                  .getVirtualNumbersServiceInfos({ number })
                  .$promise.then((serviceInfos) => {
                    set(sender, 'serviceInfos', serviceInfos);
                    return sender;
                  });
              }
              return this.$q.resolve(sender);
            }),
          )
          .then((sendersResult) => {
            this.senders.raw = sendersResult;
            this.senders.hasExpiration = some(
              this.senders.raw,
              'serviceInfos.renew.deleteAtExpiration',
            );
            this.sortSenders();
          }),
      )
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.senders.isLoading = false;
      });
  }

  /**
   * Reset all cache.
   */
  resetAllCache() {
    this.api.sms.senders.resetAllCache();
    this.api.sms.virtualNumbers.resetAllCache();
  }

  /**
   * Fetch all senders.
   * @return {Promise}
   */
  fetchSenders() {
    return this.api.sms.senders
      .query({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then((sendersIds) =>
        this.$q
          .all(
            map(
              chunk(sendersIds, 50),
              (chunkIds) =>
                this.api.sms.senders.getBatch({
                  serviceName: this.$stateParams.serviceName,
                  sender: chunkIds.join('|'),
                }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );
  }

  /**
   * Sort senders.
   */
  sortSenders() {
    let data = angular.copy(this.senders.raw);
    data = this.$filter('orderBy')(
      data,
      this.senders.orderBy,
      this.senders.orderDesc,
    );
    this.senders.sorted = data;
  }

  /**
   * Order senders.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.senders.orderBy === by) {
      this.senders.orderDesc = !this.senders.orderDesc;
    } else {
      this.senders.orderBy = by;
    }
    this.sortSenders();
  }

  /**
   * Get all senders selected.
   * @return {Array}
   */
  getSelection() {
    return filter(
      this.senders.raw,
      (sender) =>
        sender &&
        sender.type !== 'virtual' &&
        this.senders.selected &&
        this.senders.selected[sender.sender],
    );
  }

  /**
   * Delete all selected senders.
   * @return {Promise}
   */
  deleteSelectedSenders() {
    const senders = this.getSelection();
    const queries = senders.map(
      (sender) =>
        this.api.sms.senders.delete({
          serviceName: this.$stateParams.serviceName,
          sender: sender.sender,
        }).$promise,
    );
    this.senders.isDeleting = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.TucToast.info(
      this.$translate.instant('sms_senders_delete_senders_success'),
    );
    return this.$q
      .all(queries)
      .then(() => {
        this.senders.selected = {};
        return this.refresh();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.senders.isDeleting = false;
      });
  }

  /**
   * Opens a modal to edit a given sender.
   * @param  {Object} sender
   */
  edit(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      template: editTemplate,
      controller: editController,
      controllerAs: 'SendersEditCtrl',
      resolve: { sender: () => sender },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_senders_edit_sender_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to remove a given sender.
   * @param  {Object} sender
   */
  remove(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: 'SendersRemoveCtrl',
      resolve: { sender: () => sender },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_senders_remove_sender_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Opens a modal to terminate a given sender.
   * @param  {Object} sender
   */
  terminate(sender) {
    const modal = this.$uibModal.open({
      animation: true,
      template: terminateTemplate,
      controller: terminateController,
      controllerAs: 'SendersTerminateCtrl',
      resolve: { sender: () => sender },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_senders_terminate_sender_ko', {
              error: get(error, 'msg.data.message'),
            }),
          );
        }
      });
  }

  /**
   * Can edit helper.
   * @param  {Object} sender
   * @return {Boolean}
   */
  static canEdit(sender) {
    if (sender.status === 'waitingValidation') {
      return false;
    }
    return ['virtual', 'time2chat'].includes(sender.type)
      ? sender.serviceInfos.status !== 'expired'
      : true;
  }

  /**
   * Can terminate helper.
   * @param  {Object} sender
   * @return {Boolean}
   */
  static canTerminate(sender) {
    return (
      ['virtual', 'time2chat'].includes(sender.type) &&
      sender.serviceInfos.canDeleteAtExpiration &&
      sender.serviceInfos.status !== 'expired'
    );
  }

  /**
   * Get senders deleted at expiration.
   * @return {Array}
   */
  getSendersDeletedAtExpiration() {
    return filter(this.senders.raw, 'serviceInfos.renew.deleteAtExpiration');
  }
}

import angular from 'angular';
import chunk from 'lodash/chunk';
import each from 'lodash/each';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';
import 'moment';

import readController from './read/telecom-sms-sms-pending-read.controller';
import readTemplate from './read/telecom-sms-sms-pending-read.html';
import removeController from './remove/telecom-sms-sms-pending-remove.controller';
import removeTemplate from './remove/telecom-sms-sms-pending-remove.html';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $q,
    $filter,
    $uibModal,
    $translate,
    $timeout,
    OvhApiSms,
    TucToast,
    TucToastError,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$filter = $filter;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.$timeout = $timeout;
    this.api = {
      sms: {
        jobs: OvhApiSms.Jobs().v6(),
      },
    };
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.loading = {
      read: false,
      cancelAll: false,
    };
    this.pending = {
      raw: null,
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'creationDatetime',
      orderDesc: false,
      isLoading: false,
      isDeleting: false,
    };
    this.refresh();
  }

  /**
   * Refresh all pending sms.
   * @return {Promise}
   */
  refresh() {
    this.api.sms.jobs.resetAllCache();
    this.pending.isLoading = true;
    return this.fetchPendingSmsWithStatus()
      .then((pending) => {
        this.pending.raw = angular.copy(pending);
        this.applySorting();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.pending.isLoading = false;
      });
  }

  /**
   * Fetch pending sms with status.
   * @return {Promise}
   */
  fetchPendingSmsWithStatus() {
    return this.fetchPendingSms().then((pending) =>
      this.$q
        .all(
          map(pending, (sms) =>
            this.fetchPendingSmsStatus(sms.ptt).then((status) => {
              set(sms, 'status', status);
            }),
          ),
        )
        .then(() => pending),
    );
  }

  /**
   * Fetch pending sms.
   * @return {Promise}
   */
  fetchPendingSms() {
    return this.api.sms.jobs
      .query({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then((pendingIds) =>
        this.$q
          .all(
            map(
              chunk(pendingIds, 50),
              (id) =>
                this.api.sms.jobs.getBatch({
                  serviceName: this.$stateParams.serviceName,
                  id,
                }).$promise,
            ),
          )
          .then((chunkResult) => {
            const results = map(flatten(chunkResult), 'value');
            return each(results, (sms) => {
              set(
                sms,
                'scheduledDatetime',
                moment(sms.creationDatetime)
                  .add(sms.differedDelivery, 'minutes')
                  .format(),
              );
            });
          }),
      );
  }

  /**
   * Fetch pending sms status.
   * @param  {String} pttId
   * @return {Promise}
   */
  fetchPendingSmsStatus(pttId) {
    return this.api.sms.jobs
      .getPtts({
        ptt: pttId,
      })
      .$promise.then((ptt) => ptt.comment)
      .catch(() => false);
  }

  /**
   * Apply sorting.
   */
  applySorting() {
    let data = angular.copy(this.pending.raw);
    data = this.$filter('orderBy')(
      data,
      this.pending.orderBy,
      this.pending.orderDesc,
    );
    this.pending.sorted = data;
  }

  /**
   * Order pending sms.
   * @param  {String} by
   */
  orderBy(by) {
    if (this.pending.orderBy === by) {
      this.pending.orderDesc = !this.pending.orderDesc;
    } else {
      this.pending.orderBy = by;
    }
    this.applySorting();
  }

  /**
   * Get pending sms selected.
   * @return {Array}
   */
  getSelection() {
    return filter(
      this.pending.paginated,
      (pending) =>
        pending && this.pending.selected && this.pending.selected[pending.id],
    );
  }

  /**
   * Cancel all sms selected.
   * @return {Promise}
   */
  cancelSelectedPending() {
    const pendings = this.getSelection();
    const queries = pendings.map(
      (pending) =>
        this.api.sms.jobs.delete({
          serviceName: this.$stateParams.serviceName,
          id: pending.id,
        }).$promise,
    );
    this.pending.isDeleting = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.TucToast.info(
      this.$translate.instant('sms_sms_pending_cancel_success'),
    );
    return this.$q
      .all(queries)
      .then(() => {
        this.pending.selected = {};
        return this.refresh();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.pending.isDeleting = false;
      });
  }

  /**
   * Opens a modal to read a pending sms.
   * @param  {Object} pendingSms
   */
  read(pendingSms) {
    this.loading.read = true;
    const modal = this.$uibModal.open({
      animation: true,
      template: readTemplate,
      controller: readController,
      controllerAs: 'PendingReadCtrl',
      resolve: { pendingSms: () => pendingSms },
    });
    modal.rendered.then(() => {
      this.loading.read = false;
    });
  }

  /**
   * Opens a modal to remove a pending sms.
   * @param  {Object} pendingSms
   */
  remove(pendingSms) {
    const modal = this.$uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: 'PendingRemoveCtrl',
      resolve: { pendingSms: () => pendingSms },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_pending_ko', {
              error: error.message,
            }),
          );
        }
      });
  }

  /**
   * Cancel all pending sms.
   * @return {Promise}
   */
  cancelAll() {
    this.loading.cancelAll = true;
    return this.$q
      .all(
        [this.$timeout(angular.noop, 1000)].concat(
          each(
            this.pending.raw,
            (sms) =>
              this.api.sms.jobs.delete({
                serviceName: this.$stateParams.serviceName,
                id: sms.id,
              }).$promise,
          ),
        ),
      )
      .then(() => this.refresh())
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.loading.cancelAll = false;
      });
  }
}

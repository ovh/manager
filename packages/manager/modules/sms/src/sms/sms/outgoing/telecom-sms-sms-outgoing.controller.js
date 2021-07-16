import angular from 'angular';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';

import 'moment';

import readController from './read/telecom-sms-sms-outgoing-read.controller';
import readTemplate from './read/telecom-sms-sms-outgoing-read.html';
import removeController from './remove/telecom-sms-sms-outgoing-remove.controller';
import removeTemplate from './remove/telecom-sms-sms-outgoing-remove.html';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $q,
    $filter,
    $timeout,
    $window,
    $uibModal,
    $translate,
    OvhApiSms,
    OvhApiMe,
    tucDebounce,
    TucToast,
    TucToastError,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.$filter = $filter;
    this.$timeout = $timeout;
    this.$window = $window;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.api = {
      sms: OvhApiSms.v6(),
      smsOutgoing: OvhApiSms.Outgoing().v6(),
      smsJobs: OvhApiSms.Jobs().v6(),
      userDocument: OvhApiMe.Document().v6(),
    };
    this.tucDebounce = tucDebounce;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  $onInit() {
    this.outgoing = {
      raw: [],
      paginated: null,
      selected: {},
      orderBy: 'creationDatetime',
      orderDesc: true,
      filterBy: {
        receiver: undefined,
        sender: undefined,
      },
      showFilter: false,
      isLoading: false,
      isReading: false,
      isExporting: false,
      isDeleting: false,
      poller: null,
    };

    this.outgoing.isLoading = true;
    this.fetchOutgoingSms()
      .then((outgoing) => {
        this.outgoing.raw = angular.copy(outgoing);
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.outgoing.isLoading = false;
      });

    this.getDebouncedOutgoings = this.tucDebounce(
      this.refresh.bind(this),
      500,
      false,
    );

    this.$scope.$on('$destroy', () => {
      this.$timeout.cancel(this.outgoing.poller);
    });
  }

  /**
   * Fetch outgoing sms.
   * @return {Promise}
   */
  fetchOutgoingSms() {
    let sender = this.outgoing.filterBy.sender || null;
    if (
      sender ===
      this.$translate.instant('sms_sms_outgoing_number_allowed_response')
    ) {
      sender = '';
    }
    return this.api.smsOutgoing
      .query({
        serviceName: this.$stateParams.serviceName,
        receiver: this.outgoing.filterBy.receiver || null,
        sender,
      })
      .$promise.then((outgoing) => sortBy(outgoing).reverse());
  }

  /**
   * Fetch outgoing sms hlr.
   * @param  {Object} sms
   * @return {Promise}
   */
  fetchOutgoingSmsHlr(sms) {
    return this.api.smsOutgoing
      .getHlr({
        serviceName: this.$stateParams.serviceName,
        id: sms.id,
      })
      .$promise.catch(() => false);
  }

  /**
   * Get details.
   * @param  {Object} id
   * @return {Promise}
   */
  getDetails(id) {
    this.outgoing.isLoading = true;
    return this.api.smsOutgoing
      .get({
        serviceName: this.$stateParams.serviceName,
        id,
      })
      .$promise.then((outgoing) => {
        if (isEmpty(outgoing.sender)) {
          set(outgoing, 'isShortNumber', true);
          set(
            outgoing,
            'sender',
            this.$translate.instant('sms_sms_outgoing_number_allowed_response'),
          );
        }
        return this.api.smsJobs
          .getPtts({
            ptt: outgoing.ptt,
          })
          .$promise.then((ptt) => {
            set(outgoing, 'status', ptt.comment);
            return outgoing;
          });
      });
  }

  /**
   * Toggle show filter.
   */
  toggleShowFilter() {
    this.outgoing.showFilter = !this.outgoing.showFilter;
    this.outgoing.filterBy = {
      receiver: undefined,
      sender: undefined,
    };
    if (this.outgoing.showFilter === false) {
      this.refresh();
    }
  }

  /**
   * Toggle order.
   */
  toggleOrder() {
    this.outgoing.orderDesc = !this.outgoing.orderDesc;
    this.outgoing.raw.reverse();
  }

  onTransformItemDone() {
    this.outgoing.isLoading = false;
  }

  /**
   * Get all selected outgoing sms.
   * @return {Array}
   */
  getSelection() {
    return filter(
      this.outgoing.paginated,
      (outgoing) =>
        outgoing &&
        this.outgoing.selected &&
        this.outgoing.selected[outgoing.id],
    );
  }

  /**
   * Delete selected outgoing sms.
   * @return {Promise}
   */
  deleteSelectedOutgoing() {
    const outgoings = this.getSelection();
    const queries = outgoings.map(
      (outgoing) =>
        this.api.smsOutgoing.delete({
          serviceName: this.$stateParams.serviceName,
          id: outgoing.id,
        }).$promise,
    );
    this.outgoing.isDeleting = true;
    queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
    this.TucToast.info(
      this.$translate.instant('sms_sms_outgoing_delete_success'),
    );
    return this.$q
      .all(queries)
      .then(() => {
        this.outgoing.selected = {};
        return this.refresh();
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.outgoing.isDeleting = false;
      });
  }

  /**
   * Opens a modal to read outgoing sms.
   * @param  {Object} outgoingSms
   */
  read(outgoingSms) {
    const modal = this.$uibModal.open({
      animation: true,
      template: readTemplate,
      controller: readController,
      controllerAs: 'OutgoingReadCtrl',
      resolve: {
        outgoingSms: () => outgoingSms,
        outgoingSmsHlr: () => this.fetchOutgoingSmsHlr(outgoingSms),
      },
    });
    this.outgoing.isReading = true;
    modal.rendered.then(() => {
      this.outgoing.isReading = false;
    });
  }

  /**
   * Opens a modal to remove outgoing sms.
   * @param  {Object} outgoingSms
   */
  remove(outgoingSms) {
    const modal = this.$uibModal.open({
      animation: true,
      template: removeTemplate,
      controller: removeController,
      controllerAs: 'OutgoingRemoveCtrl',
      resolve: { outgoingSms: () => outgoingSms },
    });
    modal.result
      .then(() => this.refresh())
      .catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(
            this.$translate.instant('sms_sms_outgoing_remove_ko', {
              error: error.message,
            }),
          );
        }
      });
  }

  /**
   * Export history.
   * @return {Promise}
   */
  exportHistory() {
    this.outgoing.isExporting = true;
    return this.api.sms
      .getDocument({
        serviceName: this.$stateParams.serviceName,
        'creationDatetime.from': moment()
          .subtract(1, 'years')
          .format(),
        'creationDatetime.to': moment().format(),
        wayType: 'outgoing',
      })
      .$promise.then((smsDoc) => {
        // 1. We need to poll to know if the size of the document is not empty.
        const tryGetDocument = () => {
          this.api.userDocument.resetCache();
          return this.api.userDocument
            .get({
              id: smsDoc.docId,
            })
            .$promise.then((doc) => {
              if (doc.size > 0) {
                // 2. Then we set a timeout to be sure that we have data.
                return this.$timeout(() => doc, 5000);
              }
              this.outgoing.poller = this.$timeout(tryGetDocument, 1000);
              return this.outgoing.poller;
            });
        };
        return tryGetDocument().then((doc) => {
          this.$window.location.href = doc.getUrl;
        });
      })
      .catch((error) => {
        this.TucToast.error(
          this.$translate.instant('sms_sms_outgoing_download_history_ko'),
        );
        return this.$q.reject(error);
      })
      .finally(() => {
        this.outgoing.isExporting = false;
      });
  }

  /**
   * Refresh outgoing sms list.
   * @return {Promise}
   */
  refresh() {
    this.api.smsOutgoing.resetAllCache();
    this.api.smsJobs.resetAllCache();
    this.outgoing.isLoading = true;
    return this.fetchOutgoingSms()
      .then((outgoing) => {
        this.outgoing.raw = angular.copy(outgoing);
      })
      .catch((err) => {
        this.TucToastError(err);
      })
      .finally(() => {
        this.outgoing.isLoading = false;
      });
  }
}

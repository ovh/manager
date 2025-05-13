import angular from 'angular';
import set from 'lodash/set';

import readController from './read/telecom-sms-sms-outgoing-read.controller';
import readTemplate from './read/telecom-sms-sms-outgoing-read.html';
import removeController from './remove/telecom-sms-sms-outgoing-remove.controller';
import removeTemplate from './remove/telecom-sms-sms-outgoing-remove.html';

import {
  DEFAULT_FILTER_COLUMN,
  SORT_ORDER,
} from './telecom-sms-sms-outgoing.constant';

export default class TelecomSmsSmsOutgoingCtrl {
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
    ouiDatagridService,
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
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.outgoing = {
      selected: [],
      customCriteriaDates: null,
      isLoading: false,
      isReading: false,
      isExporting: false,
      isDeleting: false,
      poller: null,
    };

    this.outgoing.isLoading = true;

    this.$scope.$on('$destroy', () => {
      this.$timeout.cancel(this.outgoing.poller);
    });
  }

  fetchOutgoingSms({ offset, pageSize, sort, criteria }) {
    const defaultFilterColumn = DEFAULT_FILTER_COLUMN;
    const filters = TelecomSmsSmsOutgoingCtrl.criteriaMap(
      criteria,
      defaultFilterColumn,
    );

    const params = {
      offset,
      pageSize,
      sort: sort.property,
      sortOrder: SORT_ORDER[sort.dir],
      filters,
      defaultFilterColumn,
    };

    return this.getOutgoingSms(params).then(({ data, meta }) => {
      this.totalCount = Number(meta.totalCount);
      this.outgoing.isLoading = false;
      return {
        data,
        meta,
      };
    });
  }

  static criteriaMap(criteria, defaultFilterColumn) {
    return criteria.map((filter) => ({
      field: filter.property || defaultFilterColumn,
      comparator: filter.operator,
      reference: [filter.value],
    }));
  }

  refreshOutgoingSmsGrid() {
    return this.ouiDatagridService.refresh(
      'telecom-sms-outgoing-datagrid',
      true,
    );
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
   * Get Ptts if !== 1.
   * @param  {Object} sms
   * @return {Promise}
   */
  getPtts(sms) {
    this.outgoing.isLoading = true;
    return this.api.smsJobs
      .getPtts({
        ptt: sms.ptt,
      })
      .$promise.then((ptt) => {
        set(sms, 'status', ptt.comment);
        return sms;
      });
  }

  onRowSelect($row, $rows) {
    this.outgoing.selected = $rows;
  }

  onCriteriaChange(criteria) {
    const criteriaDate = criteria.filter(
      (filter) => filter.property === 'creationDatetime',
    );
    if (criteriaDate.length > 0) {
      this.outgoing.customCriteriaDates = criteriaDate.reduce(
        (acc, current) => {
          let newAcc = { ...acc };
          const date = current.value;
          const fromDate = moment(`${date}T00:00:00`).toISOString();
          const toDate = moment(`${date}T23:59:59`).toISOString();
          switch (current.operator) {
            case 'is':
              newAcc = {
                ...acc,
                'creationDatetime.from': fromDate,
                'creationDatetime.to': toDate,
              };
              break;
            case 'isBefore':
              newAcc = {
                ...acc,
                'creationDatetime.to': toDate,
              };
              break;
            case 'isAfter':
              newAcc = {
                ...acc,
                'creationDatetime.from': fromDate,
              };
              break;
            default:
              newAcc = { ...acc };
          }
          return newAcc;
        },
        {},
      );
    } else {
      this.outgoing.customCriteriaDates = null;
    }
  }

  /**
   * Delete selected outgoing sms.
   * @return {Promise}
   */
  deleteSelectedOutgoing() {
    const outgoings = this.outgoing.selected;
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
        this.outgoing.selected = [];
        this.refreshOutgoingSmsGrid();
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
      .then(() => this.refreshOutgoingSmsGrid())
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
        wayType: 'outgoing',
        ...(this.outgoing.customCriteriaDates && {
          ...this.outgoing.customCriteriaDates,
        }),
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
}

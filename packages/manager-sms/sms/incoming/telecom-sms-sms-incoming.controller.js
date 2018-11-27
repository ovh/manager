angular
  .module('managerApp')
  .controller('TelecomSmsSmsIncomingCtrl', class TelecomSmsSmsIncomingCtrl {
    constructor(
      $filter, $q, $scope, $stateParams, $translate, $timeout, $uibModal, $window,
      OvhApiSms, OvhApiMe, TucToast, TucToastError,
    ) {
      this.$filter = $filter;
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$timeout = $timeout;
      this.$uibModal = $uibModal;
      this.$window = $window;
      this.api = {
        sms: OvhApiSms.v6(),
        smsIncoming: OvhApiSms.Incoming().v6(),
        user: {
          document: OvhApiMe.Document().v6(),
        },
      };
      this.TucToast = TucToast;
      this.TucToastError = TucToastError;
    }

    $onInit() {
      this.incoming = {
        raw: [],
        paginated: null,
        sorted: null,
        selected: {},
        orderBy: 'creationDatetime',
        orderDesc: false,
        filterBy: {
          sender: undefined,
        },
        showFilter: false,
        isLoading: false,
        isReading: false,
        isExporting: false,
        isDeleting: false,
        poller: null,
      };
      this.serviceInfos = null;
      this.refresh();
      this.$scope.$on('$destroy', () => this.$timeout.cancel(this.incoming.poller));
    }

    /**
     * Refresh incoming sms list.
     * @return {Promise}
     */
    refresh() {
      this.api.smsIncoming.resetAllCache();
      this.incoming.isLoading = true;
      return this.$q.all({
        incoming: this.fetchIncomingSms(),
        serviceInfos: this.fetchServiceInfos(),
      }).then((results) => {
        this.incoming.raw = angular.copy(results.incoming);
        this.serviceInfos = results.serviceInfos;
        this.applySorting();
      }).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.incoming.isLoading = false;
      });
    }

    /**
     * Fetch all incoming sms.
     * @return {Promise}
     */
    fetchIncomingSms() {
      return this.api.smsIncoming
        .query({
          serviceName: this.$stateParams.serviceName,
        }).$promise
        .then(incomingIds => this.$q
          .all(_.map(_.chunk(incomingIds, 50), id => this.api.smsIncoming.getBatch({
            serviceName: this.$stateParams.serviceName,
            id,
          }).$promise))
          .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));
    }

    /**
     * Fetch service infos.
     * @return {Promise}
     */
    fetchServiceInfos() {
      return this.api.sms.getServiceInfos({
        serviceName: this.$stateParams.serviceName,
      }).$promise;
    }

    /**
     * Apply sorting.
     */
    applySorting() {
      let data = angular.copy(this.incoming.raw);
      data = this.$filter('filter')(data, this.incoming.filterBy);
      data = this.$filter('orderBy')(
        data,
        this.incoming.orderBy,
        this.incoming.orderDesc,
      );
      this.incoming.sorted = data;
    }

    /**
     * Toggle show filter.
     */
    toggleShowFilter() {
      this.incoming.showFilter = !this.incoming.showFilter;
      this.incoming.filterBy = {
        sender: undefined,
      };
      this.applySorting();
    }

    /**
     * Order incoming sms.
     * @param  {String} by
     */
    orderBy(by) {
      if (this.incoming.orderBy === by) {
        this.incoming.orderDesc = !this.incoming.orderDesc;
      } else {
        this.incoming.orderBy = by;
      }
      this.applySorting();
    }

    /**
     * Get all incoming sms selected.
     * @return {Promise}
     */
    getSelection() {
      return _.filter(
        this.incoming.raw,
        incoming => incoming && this.incoming.selected && this.incoming.selected[incoming.id],
      );
    }

    /**
     * Delete selected incoming sms.
     * @return {Promise}
     */
    deleteSelectedIncoming() {
      const incomings = this.getSelection();
      const queries = incomings.map(incoming => this.api.smsIncoming.delete({
        serviceName: this.$stateParams.serviceName,
        id: incoming.id,
      }).$promise);
      this.incoming.isDeleting = true;
      queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
      this.TucToast.info(this.$translate.instant('sms_sms_incoming_remove_success'));
      return this.$q.all(queries).then(() => {
        this.incoming.selected = {};
        return this.refresh();
      }).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.incoming.isDeleting = false;
      });
    }

    /**
     * Opens a modal to read a given incoming sms.
     * @param  {Object} incomingSms
     */
    read(incomingSms) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/sms/incoming/read/telecom-sms-sms-incoming-read.html',
        controller: 'TelecomSmsSmsIncomingReadCtrl',
        controllerAs: 'IncomingReadCtrl',
        resolve: { incomingSms: () => incomingSms },
      });
      this.incoming.isReading = true;
      modal.rendered.then(() => {
        this.incoming.isReading = false;
      });
    }

    /**
     * Opens a modal to remove a given incoming sms.
     * @param  {Object} incomingSms
     */
    remove(incomingSms) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/sms/incoming/remove/telecom-sms-sms-incoming-remove.html',
        controller: 'TelecomSmsSmsIncomingRemoveCtrl',
        controllerAs: 'IncomingRemoveCtrl',
        resolve: { incomingSms: () => incomingSms },
      });
      modal.result.then(() => this.refresh()).catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_sms_incoming_remove_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
    }

    /**
     * Export history.
     * @return {Promise}
     */
    exportHistory() {
      this.incoming.isExporting = true;
      return this.api.sms.getDocument({
        serviceName: this.$stateParams.serviceName,
        'creationDatetime.from': moment(this.serviceInfos.creation).format(),
        'creationDatetime.to': moment().format(),
        wayType: 'incoming',
      }).$promise.then((smsDoc) => {
        const tryGetDocument = () => {
          this.api.user.document.resetCache();
          return this.api.user.document.get({
            id: smsDoc.docId,
          }).$promise.then((doc) => {
            if (doc.size > 0) {
              return doc;
            }
            this.incoming.poller = this.$timeout(tryGetDocument, 1000);
            return this.incoming.poller;
          });
        };
        return tryGetDocument().then((doc) => {
          this.$window.location.href = doc.getUrl;
          this.$timeout(() => this.api.user.document.delete({ id: doc.id }).$promise, 3000);
        });
      }).catch((error) => {
        this.TucToast.error(this.$translate.instant('sms_sms_incoming_download_history_ko'));
        return this.$q.reject(error);
      }).finally(() => {
        this.incoming.isExporting = false;
      });
    }
  });

angular
  .module('managerApp')
  .controller('TelecomSmsSendersBlacklistedCtrl', class TelecomSmsSendersBlacklistedCtrl {
    constructor(
      $stateParams, $q, $filter, $timeout, $uibModal, $translate,
      OvhApiSms, TucToast, TucToastError,
    ) {
      this.$stateParams = $stateParams;
      this.$q = $q;
      this.$filter = $filter;
      this.$timeout = $timeout;
      this.$uibModal = $uibModal;
      this.$translate = $translate;
      this.api = {
        sms: {
          blacklists: OvhApiSms.Blacklists().v6(),
        },
      };
      this.TucToast = TucToast;
      this.TucToastError = TucToastError;
    }

    $onInit() {
      this.blacklists = {
        raw: [],
        paginated: null,
        sorted: null,
        selected: {},
        orderBy: 'number',
        orderDesc: false,
        isLoading: false,
        isDeleting: false,
      };
      this.refresh();
    }

    /**
     * Refresh all blacklists.
     * @return {Promise}
     */
    refresh() {
      this.api.sms.blacklists.resetAllCache();
      this.blacklists.isLoading = true;
      return this.fetchBlacklists().then((blacklists) => {
        this.blacklists.raw = angular.copy(blacklists);
        this.sortBlacklists();
      }).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.blacklists.isLoading = false;
      });
    }

    /**
     * Fetch blacklists.
     * @return {Promise}
     */
    fetchBlacklists() {
      return this.api.sms.blacklists
        .query({
          serviceName: this.$stateParams.serviceName,
        }).$promise
        .then(blacklistsIds => this.$q
          .all(_.map(blacklistsIds, number => this.api.sms.blacklists.get({
            serviceName: this.$stateParams.serviceName,
            number,
          }).$promise)));
    }

    /**
     * Sort blacklists.
     */
    sortBlacklists() {
      let data = angular.copy(this.blacklists.raw);
      data = this.$filter('orderBy')(
        data,
        this.blacklists.orderBy,
        this.blacklists.orderDesc,
      );
      this.blacklists.sorted = data;
    }

    /**
     * Order blacklists.
     * @param  {String} by
     */
    orderBy(by) {
      if (this.blacklists.orderBy === by) {
        this.blacklists.orderDesc = !this.blacklists.orderDesc;
      } else {
        this.blacklists.orderBy = by;
      }
      this.sortBlacklists();
    }

    /**
     * Get all blacklists selected.
     * @return {Array}
     */
    getSelection() {
      return _.filter(
        this.blacklists.raw,
        list => list && this.blacklists.selected && this.blacklists.selected[list.number],
      );
    }

    /**
     * Delete all selected blacklist.
     * @return {Promise}
     */
    deleteSelectedBlacklist() {
      const blackLists = this.getSelection();
      const queries = blackLists.map(list => this.api.sms.blacklists.delete({
        serviceName: this.$stateParams.serviceName,
        number: list.number,
      }).$promise);
      this.blacklists.isDeleting = true;
      queries.push(this.$timeout(angular.noop, 500)); // avoid clipping
      this.TucToast.info(this.$translate.instant('sms_senders_blacklisted_delete_list_success'));
      return this.$q.all(queries).then(() => {
        this.blacklists.selected = {};
        return this.refresh();
      }).catch((err) => {
        this.TucToastError(err);
      }).finally(() => {
        this.blacklists.isDeleting = false;
      });
    }

    /**
     * Opens a modal to remove a given blacklist.
     * @param  {Object} blacklist
     */
    remove(blacklist) {
      const modal = this.$uibModal.open({
        animation: true,
        templateUrl: 'app/telecom/sms/senders/blacklisted/remove/telecom-sms-senders-blacklisted-remove.html',
        controller: 'TelecomSmsSendersBlacklistedRemoveCtrl',
        controllerAs: 'SendersBlacklistedRemoveCtrl',
        resolve: { blacklist: () => blacklist },
      });
      modal.result.then(() => this.refresh()).catch((error) => {
        if (error && error.type === 'API') {
          this.TucToast.error(this.$translate.instant('sms_senders_blacklisted_sender_ko', { error: _.get(error, 'msg.data.message') }));
        }
      });
    }
  });

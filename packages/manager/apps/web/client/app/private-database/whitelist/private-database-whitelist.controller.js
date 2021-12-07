import find from 'lodash/find';
import forEach from 'lodash/forEach';
import { WEBHOSTING_NETWORK_STATUS } from './private-database-whitelist.constants';

angular.module('App').controller(
  'PrivateDatabaseWhitelistCtrl',
  class PrivateDatabaseWhitelistListCtrl {
    constructor(
      Alerter,
      PrivateDatabase,
      $scope,
      $http,
      $stateParams,
      $translate,
      WhitelistService,
    ) {
      this.alerter = Alerter;
      this.privateDatabaseService = PrivateDatabase;
      this.$scope = $scope;
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.whitelistService = WhitelistService;
    }

    $onInit() {
      const statusToWatch = ['start', 'done', 'error'];
      this.serviceName = this.$stateParams.productId;

      this.getList();
      this.getWebhostingNetworkStatus();

      this.privateDatabaseService.restartPoll(this.serviceName, [
        'whitelist/delete',
        'whitelist/create',
        'webhostingNetwork/enable',
        'webhostingNetwork/disable',
      ]);

      forEach(statusToWatch, (state) => {
        this.$scope.$on(
          `privateDatabase.whitelist.create.${state}`,
          this[`onWhitelistCreate${state}`].bind(this),
        );
        this.$scope.$on(
          `privateDatabase.whitelist.delete.${state}`,
          this[`onWhitelistDelete${state}`].bind(this),
        );
      });
      this.$scope.$on('privateDatabase.whitelist.update.done', (opts) =>
        opts.serviceName === this.serviceName ? this.getList() : undefined,
      );

      forEach(['done', 'error'], (state) => {
        this.$scope.$on(
          `privateDatabase.global.actions.${state}`,
          (e, taskOpt) => {
            this.$scope.lockAction = taskOpt.lock
              ? false
              : this.$scope.lockAction;
          },
        );

        forEach(['enable', 'disable'], (action) => {
          this.$scope.$on(
            `privateDatabase.webhostingNetwork.${action}.${state}`,
            (e, message) => {
              this.handleWebhostingNetworkUpdate(state, message);
            },
          );
        });
      });

      this.$scope.$on('privateDatabase.global.actions.start', (e, taskOpt) => {
        this.$scope.lockAction = taskOpt.lock || this.$scope.lockAction;
      });
    }

    getList() {
      this.whitelistIps = null;

      return this.whitelistService
        .getWhitelistIds(this.serviceName)
        .then((res) => {
          this.whitelistIps = res.map((id) => ({ id }));
          return this.whitelistIps;
        })
        .catch((err) => this.alerter.error(err));
    }

    createWhitelist() {
      this.$scope.setAction('whitelist/add/private-database-whitelist-add');
    }

    editWhitelist(whitelist) {
      this.$scope.setAction(
        'whitelist/update/private-database-whitelist-update',
        whitelist,
      );
    }

    deleteWhitelist(whitelist) {
      this.$scope.setAction(
        'whitelist/delete/private-database-whitelist-delete',
        whitelist,
      );
    }

    transformItem(whitelist) {
      return this.whitelistService
        .getWhitelist(this.serviceName, whitelist.id)
        .catch((err) => this.alerter.error(err));
    }

    /*
            POLLING
        */
    onWhitelistCreatestart(evt, opts) {
      this.whitelistIps.push({
        ip: opts.whitelistIp,
        creating: true,
        name: '',
      });
    }

    onWhitelistCreatedone() {
      this.getList();
    }

    onWhitelistCreateerror() {
      this.alerter.error(
        this.$translate.instant('privateDatabase_modale_whitelist_add_fail'),
        this.$scope.alerts.main,
      );
      this.getList();
    }

    onWhitelistDeletestart(evt, opts) {
      let unregister = null;

      const todo = () => {
        const el = find(
          this.whitelistIps,
          (whitelist) => whitelist.ip === opts.whitelistIp,
        );

        if (el) {
          el.deleting = true;

          if (unregister) {
            unregister();
          }
        }
      };

      if (this.whitelistIps && this.whitelistIps.length) {
        todo();
      } else {
        unregister = this.$scope.$watch(
          angular.bind(
            this,
            () => this.whitelistIps && this.whitelistIps.length,
          ),
          todo,
        );
      }
    }

    onWhitelistDeletedone() {
      this.getList();
    }

    onWhitelistDeleteerror(evt, opts) {
      let unregister = null;

      const todo = () => {
        const el = find(
          this.whitelistIps,
          (whitelist) => whitelist.ip === opts.whitelistIp,
        );

        if (el) {
          delete el.deleting;

          this.alerter.error(
            this.$translate.instant(
              'privateDatabase_modale_whitelist_delete_fail',
            ),
            this.$scope.alerts.main,
          );

          if (unregister) {
            unregister();
          }
        }
      };

      if (this.whitelistIps && this.whitelistIps.length) {
        todo();
      } else {
        unregister = this.$scope.$watch(
          angular.bind(
            this,
            () => this.whitelistIps && this.whitelistIps.length,
          ),
          todo,
        );
      }
    }

    getWebhostingNetworkStatus() {
      return this.whitelistService
        .getWebhostingNetworkStatus(this.serviceName)
        .then((res) => {
          this.webhostingNetworkStatus = res;

          this.isWebhostingNetworkDisplayOn = [
            WEBHOSTING_NETWORK_STATUS.enabling,
            WEBHOSTING_NETWORK_STATUS.enabled,
          ].includes(this.webhostingNetworkStatus);

          this.isWebhostingNewtworkChangeDisabled = [
            WEBHOSTING_NETWORK_STATUS.enabling,
            WEBHOSTING_NETWORK_STATUS.disabling,
          ].includes(this.webhostingNetworkStatus);
        })
        .catch((err) => this.alerter.error(err));
    }

    onWebhostingNetworkStatusChange() {
      switch (this.webhostingNetworkStatus) {
        case WEBHOSTING_NETWORK_STATUS.disabled:
          this.enableWebhostingNetwork(this.serviceName);
          break;
        case WEBHOSTING_NETWORK_STATUS.enabled:
          this.disableWebhostingNetwork(this.serviceName);
          break;
        default:
          return;
      }

      this.isWebhostingNewtworkChangeDisabled = true;
      this.alerter.success(
        this.$translate.instant(
          'private_database_tabs_whitelist_webhosting_network_access_success',
        ),
        this.$scope.alerts.main,
      );
    }

    handleWebhostingNetworkUpdate(state, message) {
      this.getWebhostingNetworkStatus();
      this.isWebhostingNewtworkChangeDisabled = false;
      if (state === 'error') {
        this.alerter.error(message, this.$scope.alerts.main);
      }
    }

    /**
     * Enable webhosting access to database
     * @param  {string} serviceName
     * @return {Promise}
     */
    enableWebhostingNetwork(serviceName) {
      return this.$http
        .post(
          `${this.whitelistService.rootPath}/${this.whitelistService.swsProxypassPath}/${serviceName}/webhostingNetwork`,
        )
        .then((res) => {
          const taskId = res.data.id;
          this.pollWebhostingNetwork(serviceName, taskId, 'enable');
        })
        .catch((err) => {
          this.$scope.$broadcast(
            'privateDatabase.webhostingNetwork.enable.error',
            err.data.message,
          );
        });
    }

    /**
     * Disable webhosting access to database
     * @param  {string} serviceName
     * @return {Promise}
     */
    disableWebhostingNetwork(serviceName) {
      return this.$http
        .delete(
          `${this.whitelistService.rootPath}/${this.whitelistService.swsProxypassPath}/${serviceName}/webhostingNetwork`,
        )
        .then((res) => {
          const taskId = res.data.id;
          this.pollWebhostingNetwork(serviceName, taskId, 'disable');
        })
        .catch((err) => {
          this.$scope.$broadcast(
            'privateDatabase.webhostingNetwork.disable.error',
            err.data.message,
          );
        });
    }

    /**
     * Poll task to enable or disable webhosting access to database
     * @param  {string} serviceName
     * @param  {number} taskId
     * @param  {string} eventType
     * @return {Promise}
     */
    pollWebhostingNetwork(serviceName, taskId, eventType) {
      const opts = {
        namespace: `webhostingNetwork.${eventType}`,
        taskId,
      };

      return this.privateDatabaseService
        .poll(serviceName, opts)
        .then((response) =>
          this.webhostingNetworkEventBroadcast(eventType, 'done', response),
        )
        .catch((err) =>
          this.webhostingNetworkEventBroadcast(eventType, 'error', err),
        );
    }

    /**
     * Broadcast end of task to enable or disable webhosting access to database
     * @param  {string} eventType
     * @param  {string} eventResult
     */
    webhostingNetworkEventBroadcast(eventType, eventResult, message) {
      this.$scope.$broadcast(
        `privateDatabase.webhostingNetwork.${eventType}.${eventResult}`,
        message,
      );
    }
  },
);

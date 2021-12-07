import defaults from 'lodash/defaults';

angular.module('services').service(
  'WhitelistService',
  class WhitelistService {
    constructor($http, PrivateDatabase, $q, $rootScope, $stateParams) {
      this.$http = $http;
      this.privateDatabaseService = PrivateDatabase;
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$stateParams = $stateParams;

      this.swsProxypassPath = 'hosting/privateDatabase';

      this.rootPath = 'apiv6';
    }

    /**
     * Get all whitelistIds allowed on the privatesql
     * @param  {string} serviceName
     * @return {ipBlock[]}
     */
    getWhitelistIds(serviceName) {
      return this.$http
        .get(
          `${this.rootPath}/${this.swsProxypassPath}/${serviceName}/whitelist`,
        )
        .then((res) => res.data);
    }

    /**
     * Create a new IP whitelist
     * @param  {string} serviceName
     * @param  {{ip: ipBlock, name: string, service: boolean, sftp: boolean}} model
     */
    createWhitelist(serviceName, model) {
      return this.$http
        .post(
          `${this.rootPath}/${this.swsProxypassPath}/${serviceName}/whitelist`,
          {
            ip: model.ip,
            name: model.name,
            service: model.service,
            sftp: model.sftp,
          },
        )
        .then((res) => {
          this.pollwhitelistcreate(serviceName, {
            taskId: res.data.id,
            taskFunction: res.data.function.replace('privateDatabase/', ''),
            whitelistIp: model.ip,
          });

          return res.data.id;
        });
    }

    pollwhitelistcreate(serviceName, opts) {
      const namespace = `privateDatabase.${opts.taskFunction.replace(
        /\//g,
        '.',
      )}`;
      const options = angular.copy(opts);
      options.namespace = namespace;

      return this.privateDatabaseService
        .poll(serviceName, {
          taskId: opts.taskId,
          whitelistIp: opts.whitelistIp,
          namespace,
        })
        .then(() => this.whitelistcreateSuccess(serviceName, options))
        .catch(() => this.whitelistcreateError(options));
    }

    whitelistcreateSuccess(serviceName, opts) {
      return this.getWhitelistIds(serviceName).then((whitelistIds) => {
        const options = angular.copy(opts);

        options.whitelistIds = whitelistIds;
        this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
      });
    }

    whitelistcreateError(opts) {
      this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
    }

    killPollWhitelistCreate() {
      this.pollService.kill({ namespace: 'privateDatabase.whitelist.create' });
    }

    /**
     * Get data of an whitelist
     * @param  {string} serviceName
     * @param  {ipBlock} whitelistId
     * @return {whitelist}
     */
    getWhitelist(serviceName, whitelistId) {
      return this.$http
        .get(
          `${this.rootPath}/${
            this.swsProxypassPath
          }/${serviceName}/whitelist/${encodeURIComponent(whitelistId)}`,
        )
        .then((res) => res.data);
    }

    /**
     * Alter a whitelist
     * @param  {string} serviceName
     * @param  {ipBlock} whitelistId
     * @param  { { name: string, service: boolean, sftp: boolean } } model
     * @return {void}
     */
    updateWhitelist(serviceName, whitelistId, model) {
      return this.$http
        .put(
          `${this.rootPath}/${
            this.swsProxypassPath
          }/${serviceName}/whitelist/${encodeURIComponent(whitelistId)}`,
          model,
        )
        .then((res) => {
          this.$rootScope.$broadcast(
            'privateDatabase.whitelist.create.done',
            defaults(res.data, { serviceName }),
          );
          return res.data;
        });
    }

    /**
     * Delete an IP whitelist
     * @param  {string} serviceName
     * @param  {ipBlock} whitelistId
     * @return {task}
     */
    deleteWhitelist(serviceName, whitelistId) {
      return this.$http
        .delete(
          `${this.rootPath}/${
            this.swsProxypassPath
          }/${serviceName}/whitelist/${encodeURIComponent(whitelistId)}`,
        )
        .then((res) => {
          this.pollwhitelistdelete(serviceName, {
            taskId: res.data.id,
            taskFunction: res.data.function.replace('privateDatabase/', ''),
            whitelistIp: whitelistId,
          });

          return res.data.id;
        })
        .catch((err) => this.$q.reject(err));
    }

    pollwhitelistdelete(serviceName, opts) {
      const namespace = `privateDatabase.${opts.taskFunction.replace(
        /\//g,
        '.',
      )}`;
      const options = angular.copy(opts);
      options.namespace = namespace;

      return this.privateDatabaseService
        .poll(serviceName, {
          taskId: opts.taskId,
          whitelistIp: opts.whitelistIp,
          namespace,
        })
        .then(() => this.whitelistdeleteSuccess(serviceName, options))
        .catch(() => this.whitelistdeleteError(options));
    }

    whitelistdeleteSuccess(serviceName, opts) {
      return this.getWhitelistIds(serviceName).then((whitelistIds) => {
        const options = angular.copy(opts);

        options.whitelistIds = whitelistIds;
        this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
      });
    }

    whitelistdeleteError(opts) {
      this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
    }

    killPollWhitelistDelete() {
      this.pollService.kill({ namespace: 'privateDatabase.whitelist.delete' });
    }

    /**
     * Get status of webhosting access to database
     * @param  {string} serviceName
     * @return {string}
     */
    getWebhostingNetworkStatus(serviceName) {
      return this.$http
        .get(
          `${this.rootPath}/${this.swsProxypassPath}/${serviceName}/webhostingNetwork`,
        )
        .then(({ data }) => data.status);
    }
  },
);

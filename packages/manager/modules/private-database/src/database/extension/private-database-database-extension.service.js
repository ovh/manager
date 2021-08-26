import angular from 'angular';

export default class PrivateDatabaseExtension {
  /* @ngInject */
  constructor($http, $rootScope, Poll, PrivateDatabase) {
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.pollService = Poll;
    this.privateDatabaseService = PrivateDatabase;
  }

  /**
   * Get all extensions ids
   * @param  {string} serviceName
   * @param  {string} databaseName
   * @param  {string} extensionName
   * @param  {string} status        ["disabled", "disabling", "enable", "enabling"]
   * @return {string[]}             Extension ids
   */
  getExtensions(serviceName, databaseName, extensionName, status) {
    return this.$http
      .get(
        `apiv6/hosting/privateDatabase/${serviceName}/database/${databaseName}/extension`,
        {
          params: {
            extensionName,
            status,
          },
        },
      )
      .then((res) => res.data);
  }

  /**
   * Get extension details
   * @param  {string} serviceName
   * @param  {string} databaseName
   * @param  {string} extensionName extension id
   * @return {Object}               Extension details
   */
  getExtension(serviceName, databaseName, extensionName) {
    return this.$http
      .get(
        `apiv6/hosting/privateDatabase/${serviceName}/database/${databaseName}/extension/${extensionName}`,
      )
      .then((res) => res.data);
  }

  /**
   * Get extension details
   * @param  {string} serviceName
   * @param  {string} databaseName
   * @param  {string} extensionName extensionId
   * @return {number}               taskId
   */
  disableExtension(serviceName, databaseName, extensionName) {
    return this.$http
      .post(
        `apiv6/hosting/privateDatabase/${serviceName}/database/${databaseName}/extension/${extensionName}/disable`,
      )
      .then((task) => {
        this.pollExtensionDisable(serviceName, {
          taskId: task.data.id,
          taskFunction: task.data.function.replace('privateDatabase/', ''),
          databaseName,
          extensionName,
        });

        return task.data.id;
      });
  }

  pollExtensionDisable(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.privateDatabaseService
      .poll(serviceName, {
        taskId: opts.taskId,
        namespace,
        databaseName: opts.databaseName,
        extensionName: opts.extensionName,
      })
      .then(() => this.extensionEnableSuccess(serviceName, options))
      .catch(() => this.extensionEnableError(options));
  }

  extensionDisableSuccess(serviceName, opts) {
    return this.getExtensions(
      serviceName,
      opts.databaseName,
      opts.extensionName,
    ).then((extensions) => {
      const options = angular.copy(opts);

      options.extensions = extensions;
      this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
    });
  }

  extensionDisableError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  killPollExtensionDisable() {
    this.pollService.kill({
      namespace: 'privateDatabase.database.extension.delete',
    });
  }

  /**
   * Get extension details
   * @param  {string} serviceName
   * @param  {string} databaseName
   * @param  {string} extensionName extensionId
   * @return {number}               taskId
   */
  enableExtension(serviceName, databaseName, extensionName) {
    return this.$http
      .post(
        `apiv6/hosting/privateDatabase/${serviceName}/database/${databaseName}/extension/${extensionName}/enable`,
      )
      .then((task) => {
        this.pollExtensionEnable(serviceName, {
          taskId: task.data.id,
          taskFunction: task.data.function.replace('privateDatabase/', ''),
          databaseName,
          extensionName,
        });

        return task.data.id;
      });
  }

  pollExtensionEnable(serviceName, opts) {
    const namespace = `privateDatabase.${opts.taskFunction.replace(
      /\//g,
      '.',
    )}`;
    const options = angular.copy(opts);
    options.namespace = namespace;

    return this.privateDatabaseService
      .poll(serviceName, {
        taskId: opts.taskId,
        namespace,
        databaseName: opts.databaseName,
        extensionName: opts.extensionName,
      })
      .then(() => this.extensionEnableSuccess(serviceName, options))
      .catch(() => this.extensionEnableError(options));
  }

  extensionEnableSuccess(serviceName, opts) {
    return this.getExtensions(
      serviceName,
      opts.databaseName,
      opts.extensionName,
    ).then((extensions) => {
      const options = angular.copy(opts);

      options.extensions = extensions;
      this.$rootScope.$broadcast(`${opts.namespace}.done`, options);
    });
  }

  extensionEnableError(opts) {
    this.$rootScope.$broadcast(`${opts.namespace}.error`, opts);
  }

  killPollExtensionEnable() {
    this.pollService.kill({
      namespace: 'privateDatabase.database.extension.create',
    });
  }
}

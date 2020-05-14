import keyBy from 'lodash/keyBy';
import set from 'lodash/set';

class LogsAliasesService {
  constructor(
    $q,
    $translate,
    OvhApiDbaas,
    CucServiceHelper,
    CucCloudPoll,
    LogsHelperService,
    LogsConstants,
    CucUrlHelper,
    CucCloudMessage,
    LogsStreamsService,
    LogsIndexService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucServiceHelper = CucServiceHelper;
    this.AliasApiService = OvhApiDbaas.Logs()
      .Alias()
      .v6();
    this.AliasAapiService = OvhApiDbaas.Logs()
      .Alias()
      .Aapi();
    this.OperationApiService = OvhApiDbaas.Logs()
      .Operation()
      .v6();
    this.CucCloudPoll = CucCloudPoll;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.CucUrlHelper = CucUrlHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsIndexService = LogsIndexService;

    this.contentTypeEnum = keyBy(['STREAMS', 'INDICES']);
    this.contents = [
      { value: this.contentTypeEnum.STREAMS, name: 'logs_streams_title' },
      { value: this.contentTypeEnum.INDICES, name: 'logs_index_title' },
    ];
  }

  getContents() {
    return this.contents;
  }

  /**
   * returns array of aliases with details
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of aliases.
   *          Each alias will have all details populated.
   * @memberof LogsAliasesService
   */
  getAliases(serviceName) {
    return this.getAliasesDetails(serviceName).catch((err) =>
      this.LogsHelperService.handleError('logs_aliases_get_error', err, {}),
    );
  }

  /**
   * returns array of owned aliases with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of aliases.
   *          Each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getOwnAliases(serviceName) {
    return this.getAliasesDetails(serviceName)
      .then((aliases) => aliases.filter((alias) => alias.info.isEditable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_aliases_get_error', err, {}),
      );
  }

  /**
   * returns array of shareable aliases with details of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of aliases.
   *          Each stream will have all details populated.
   * @memberof LogsStreamsService
   */
  getShareableAliases(serviceName) {
    return this.getAliasesDetails(serviceName)
      .then((aliases) => aliases.filter((alias) => alias.info.isShareable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_aliases_get_error', err, {}),
      );
  }

  /**
   * gets details for each alias in array
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to an array of alias objects
   * @memberof LogsAliasesService
   */
  getAliasesDetails(serviceName) {
    return this.getAliasesIds(serviceName).then((aliases) => {
      const promises = aliases.map((aliasId) =>
        this.getAapiAlias(serviceName, aliasId),
      );
      return this.$q.all(promises);
    });
  }

  /**
   * returns array of aliases id's of logged in user
   *
   * @param {any} serviceName
   * @returns promise which will be resolve to array of aliases id's
   * @memberof LogsAliasesService
   */
  getAliasesIds(serviceName) {
    return this.AliasApiService.query({ serviceName }).$promise;
  }

  /**
   * returns details of an alias
   *
   * @param {any} serviceName
   * @param {any} aliasId
   * @returns promise which will be resolve to alias object
   * @memberof LogsAliasesService
   */
  getAlias(serviceName, aliasId) {
    return this.AliasApiService.get({
      serviceName,
      aliasId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError('logs_alias_get_error', err, {}),
    );
  }

  getAliasWithStreamsAndIndices(serviceName, aliasId) {
    return this.AliasAapiService.get({ serviceName, aliasId })
      .$promise.then((alias) => {
        if (alias.streams.length > 0) {
          const promises = alias.streams.map((streamId) =>
            this.LogsStreamsService.getAapiStream(serviceName, streamId),
          );
          return this.$q.all(promises).then((streams) => {
            set(alias, 'streams', streams);
            return alias;
          });
        }
        if (alias.indexes.length > 0) {
          const promises = alias.indexes.map((indexId) =>
            this.LogsIndexService.getIndexDetails(serviceName, indexId),
          );
          return this.$q.all(promises).then((indices) => {
            set(alias, 'indexes', indices);
            return alias;
          });
        }
        return alias;
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_alias_get_error', err, {}),
      );
  }

  /**
   * returns details of an alias
   *
   * @param {any} serviceName
   * @param {any} aliasId
   * @returns promise which will be resolve to alias object
   * @memberof LogsAliasesService
   */
  getAapiAlias(serviceName, aliasId) {
    return this.AliasAapiService.get({
      serviceName,
      aliasId,
    }).$promise.catch((err) =>
      this.LogsHelperService.handleError('logs_alias_get_error', err, {}),
    );
  }

  /**
   * delete alias
   *
   * @param {any} serviceName
   * @param {any} alias, alias object to be deleted
   * @returns promise which will be resolve to operation object
   * @memberof LogsAliasesService
   */
  deleteAlias(serviceName, alias) {
    return this.AliasApiService.delete(
      { serviceName, aliasId: alias.aliasId },
      alias,
    )
      .$promise.then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_aliases_delete_success',
          { aliasName: alias.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_aliases_delete_error', err, {
          aliasName: alias.name,
        }),
      );
  }

  /**
   * create new alias
   *
   * @param {any} serviceName
   * @param {any} alias, alias object to be created
   * @returns promise which will be resolve to operation object
   * @memberof LogsAliasesService
   */
  createAlias(serviceName, alias) {
    return this.AliasApiService.create(
      { serviceName },
      {
        description: alias.description,
        suffix: alias.suffix,
      },
    )
      .$promise.then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_aliases_create_success',
          { aliasName: alias.suffix },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_aliases_create_error', err, {
          aliasName: alias.suffix,
        }),
      );
  }

  /**
   * update alias
   *
   * @param {any} serviceName
   * @param {any} alias, alias object to be updated
   * @returns promise which will be resolve to operation object
   * @memberof LogsAliasesService
   */
  updateAlias(serviceName, alias) {
    return this.AliasApiService.update(
      { serviceName, aliasId: alias.aliasId },
      {
        description: alias.description,
      },
    )
      .$promise.then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_aliases_update_success',
          { aliasName: alias.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_aliases_update_error', err, {
          aliasName: alias.name,
        }),
      );
  }

  attachStream(serviceName, alias, stream) {
    return this.AliasApiService.linkStream(
      { serviceName, aliasId: alias.aliasId },
      { streamId: stream.streamId },
    )
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          stream.indexingEnabled
            ? null
            : 'logs_aliases_attach_stream_not_indexed',
          { streamName: stream.title },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_attach_stream_error',
          err,
          { streamName: stream.title },
        ),
      );
  }

  detachStream(serviceName, alias, stream) {
    return this.AliasApiService.unlinkStream({
      serviceName,
      aliasId: alias.aliasId,
      streamId: stream.streamId,
    })
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_detach_stream_error',
          err,
          { streamName: stream.title },
        ),
      );
  }

  attachIndex(serviceName, alias, index) {
    return this.AliasApiService.linkIndex(
      { serviceName, aliasId: alias.aliasId },
      { indexId: index.indexId },
    )
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_attach_index_error',
          err,
          { indexName: index.name },
        ),
      );
  }

  detachIndex(serviceName, alias, index) {
    return this.AliasApiService.unlinkIndex({
      serviceName,
      aliasId: alias.aliasId,
      indexId: index.indexId,
    })
      .$promise.then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_detach_index_error',
          err,
          { indexName: index.name },
        ),
      );
  }

  /**
   * creates new alias with default values
   *
   * @returns alias object with default values
   * @memberof LogsAliasesService
   */
  static getNewAlias() {
    return {
      data: {
        description: null,
        suffix: null,
      },
      loading: false,
    };
  }

  getElasticSearchUrl(alias) {
    const url = this.CucUrlHelper.constructor.findUrl(
      alias,
      this.LogsConstants.ELASTICSEARCH_API_URL,
    );
    if (!url) {
      this.CucCloudMessage.error(
        this.$translate.instant('logs_aliases_get_elasticsearch_url_error', {
          alias: alias.info.name,
        }),
      );
    }
    return url;
  }
}

angular.module('managerApp').service('LogsAliasesService', LogsAliasesService);

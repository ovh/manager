import keyBy from 'lodash/keyBy';
import set from 'lodash/set';

export default class LogsAliasesService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    iceberg,
    CucServiceHelper,
    CucCloudPoll,
    LogsHelperService,
    LogsConstants,
    CucUrlHelper,
    CucCloudMessage,
    LogsStreamsService,
    LogsIndexService,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucServiceHelper = CucServiceHelper;
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
    return this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/alias`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute()
      .$promise.catch((error) => {
        this.LogsHelperService.handleError(
          error.data,
          'logs_aliases_get_error',
        );
        return { data: [] };
      });
  }

  getPaginatedAliases(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'name', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/alias`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    return res.execute().$promise.then((response) => ({
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  getAliasIds(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/alias`)
      .query()
      .execute()
      .$promise.then(({ data }) => data)
      .catch((error) => {
        this.LogsHelperService.handleError(
          'logs_aliases_get_error',
          error.data,
        );
        return [];
      });
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
    return this.getAliases(serviceName).then(({ data = [] }) =>
      data.filter((alias) => alias.isEditable),
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
  getAlias(serviceName, aliasId) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/opensearch/alias/${aliasId}`)
      .catch((err) =>
        this.LogsHelperService.handleError('logs_alias_get_error', err, {}),
      );
  }

  getAliasWithStreamsAndIndices(serviceName, aliasId) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/opensearch/alias/${aliasId}`)
      .then((alias) => {
        if (alias.data.nbStream > 0) {
          return this.LogsStreamsService.getStreamsForAlias(
            serviceName,
            aliasId,
          ).then((streams) => {
            set(alias, 'streams', streams);
            return alias;
          });
        }
        if (alias.data.nbIndex > 0) {
          return this.LogsIndexService.getIndicesForAlias(
            serviceName,
            aliasId,
          ).then((indices) => {
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
   * delete alias
   *
   * @param {any} serviceName
   * @param {any} alias, alias object to be deleted
   * @returns promise which will be resolve to operation object
   * @memberof LogsAliasesService
   */
  deleteAlias(serviceName, alias) {
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}`,
      )
      .then((operation) => {
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
    return this.$http
      .post(`/dbaas/logs/${serviceName}/output/opensearch/alias`, {
        description: alias.description,
        suffix: alias.suffix,
      })
      .then((operation) => {
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
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}`,
        {
          description: alias.description,
        },
      )
      .then((operation) => {
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
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}/stream`,
        {
          streamId: stream.streamId,
        },
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          stream.indexingEnabled
            ? null
            : 'logs_aliases_attach_stream_not_indexed',
          { streamName: stream.title },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_attach_stream_error',
          err,
          {
            streamName: stream.title,
          },
        ),
      );
  }

  detachStream(serviceName, alias, stream) {
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}/stream/${stream.streamId}`,
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_detach_stream_error',
          err,
          {
            streamName: stream.title,
          },
        ),
      );
  }

  attachIndex(serviceName, alias, index) {
    return this.$http
      .post(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}/index`,
        {
          indexId: index.indexId,
        },
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_attach_index_error',
          err,
          {
            indexName: index.name,
          },
        ),
      );
  }

  detachIndex(serviceName, alias, index) {
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}/index/${index.indexId}`,
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_aliases_detach_index_error',
          err,
          {
            indexName: index.name,
          },
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

  getOpenSearchUrl(serviceName, alias) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${alias.aliasId}/url`,
      )
      .then(({ data: urls }) =>
        this.CucUrlHelper.constructor.findUrl(
          { urls },
          this.LogsConstants.OPENSEARCH_API_URL,
        ),
      );
  }
}

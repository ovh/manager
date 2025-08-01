export default class LogsIndexService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $translate,
    iceberg,
    CucCloudPoll,
    CucControllerHelper,
    LogsHelperService,
    CucUrlHelper,
    CucServiceHelper,
    LogsConstants,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucCloudPoll = CucCloudPoll;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHelperService = LogsHelperService;
    this.CucUrlHelper = CucUrlHelper;
    this.CucServiceHelper = CucServiceHelper;
    this.LogsConstants = LogsConstants;
    this.newIndex = {
      description: '',
      alertNotifyEnabled: false,
      nbShard: this.LogsConstants.NB_SHARD_MIN,
    };
  }

  getNewIndex() {
    return this.newIndex;
  }

  getIndices(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/index`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute()
      .$promise.catch((err) => {
        this.LogsHelperService.handleError('logs_index_get_error', err.data);
        return { data: [] };
      });
  }

  getPaginatedIndices(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'name', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/index`)
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

  getIndiceIds(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/index`)
      .query()
      .execute()
      .$promise.then(({ data }) => data)
      .catch((error) => {
        this.LogsHelperService.handleError('logs_index_get_error', error.data);
        return [];
      });
  }

  getIndicesForAlias(serviceName, aliasId) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/opensearch/alias/${aliasId}/index`,
      )
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_get_error', err.data),
      );
  }

  getOwnIndices(serviceName) {
    return this.getIndices(serviceName).then(({ data = [] }) =>
      data.filter((index) => index.isEditable),
    );
  }

  getIndex(serviceName, indexId) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/opensearch/index/${indexId}`)
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_get_error', err.data),
      );
  }

  deleteModal(indexName) {
    return this.CucControllerHelper.modal.showDeleteModal({
      titleText: this.$translate.instant('logs_modal_delete_title'),
      textHtml: this.$translate.instant('logs_modal_delete_question', {
        indexName,
      }),
    });
  }

  createIndex(serviceName, object) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/output/opensearch/index`, {
        alertNotifyEnabled: object.alertNotifyEnabled,
        description: object.description,
        suffix: object.suffix,
        nbShard: object.nbShard,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_index_create_success',
          { name: object.suffix },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_create_error', err, {
          name: object.suffix,
        }),
      );
  }

  updateIndex(serviceName, index, indexInfo) {
    return this.$http
      .put(
        `/dbaas/logs/${serviceName}/output/opensearch/index/${index.indexId}`,
        {
          description: indexInfo.description,
          alertNotifyEnabled: indexInfo.alertNotifyEnabled,
        },
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_index_edit_success',
          { name: index.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_edit_error', err, {
          name: index.name,
        }),
      );
  }

  deleteIndex(serviceName, index) {
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/output/opensearch/index/${index.indexId}`,
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_index_delete_success',
          { name: index.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_delete_error', err, {
          name: index.name,
        }),
      );
  }

  getOpenSearchUrl(serviceName, index) {
    return this.$http
      .get(
        `/dbaas/logs/${serviceName}/output/opensearch/index/${index.indexId}/url`,
      )
      .then(({ data: urls }) =>
        this.CucUrlHelper.constructor.findUrl(
          { urls },
          this.LogsConstants.OPENSEARCH_API_URL,
        ),
      );
  }
}

import set from 'lodash/set';

export default class LogsIndexService {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    CucCloudPoll,
    CucControllerHelper,
    LogsHelperService,
    OvhApiDbaas,
    CucServiceHelper,
    LogsConstants,
    LogsHomeService,
    LogsOrderService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudPoll = CucCloudPoll;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHelperService = LogsHelperService;
    this.CucServiceHelper = CucServiceHelper;
    this.LogsConstants = LogsConstants;
    this.LogsHomeService = LogsHomeService;
    this.LogsOrderService = LogsOrderService;
    this.IndexApiService = OvhApiDbaas.Logs()
      .Index()
      .v6();
    this.IndexAapiService = OvhApiDbaas.Logs()
      .Index()
      .Aapi();
    this.OperationApiService = OvhApiDbaas.Logs()
      .Operation()
      .v6();
    this.newIndex = {
      description: '',
      alertNotifyEnabled: false,
      nbShard: this.LogsConstants.NB_SHARD_MIN,
    };
  }

  getAccountDetails(serviceName) {
    return this.LogsHomeService.getAccountDetails(serviceName);
  }

  getOrderCatalog(ovhSubsidiary) {
    return this.LogsOrderService.getOrderCatalog(ovhSubsidiary);
  }

  getNewIndex() {
    return this.newIndex;
  }

  getIndicesIds(serviceName) {
    return this.IndexApiService.query({ serviceName }).$promise;
  }

  getIndices(serviceName) {
    return this.getIndicesIds(serviceName)
      .then((indices) => {
        const promises = indices.map((indexId) =>
          this.getIndexDetails(serviceName, indexId),
        );
        return this.$q.all(promises);
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_get_error', err, {}),
      );
  }

  getOwnIndices(serviceName) {
    return this.getIndices(serviceName)
      .then((indices) => indices.filter((index) => index.info.isEditable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_index_get_error', err, {}),
      );
  }

  getIndexDetails(serviceName, indexId) {
    return this.IndexAapiService.get({
      serviceName,
      indexId,
    }).$promise.then((index) => this.constructor.transformAapiIndex(index));
  }

  static transformAapiIndex(index) {
    if (index.info.currentStorage < 0) {
      set(index, 'info.currentStorage', 0);
    }
    if (index.info.maxSize < 0) {
      set(index, 'info.maxSize', 0);
    }
    return index;
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
    return this.IndexApiService.post(
      { serviceName },
      {
        alertNotifyEnabled: object.alertNotifyEnabled,
        description: object.description,
        suffix: object.suffix,
        nbShard: object.nbShard,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
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
    return this.IndexApiService.put(
      { serviceName, indexId: index.indexId },
      {
        description: indexInfo.description,
        alertNotifyEnabled: indexInfo.alertNotifyEnabled,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
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
    return this.IndexApiService.delete({ serviceName, indexId: index.indexId })
      .$promise.then((operation) => {
        this.resetAllCache();
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

  resetAllCache() {
    this.IndexApiService.resetAllCache();
    this.IndexAapiService.resetAllCache();
  }
}

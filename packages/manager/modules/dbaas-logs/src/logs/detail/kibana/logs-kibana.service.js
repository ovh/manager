import set from 'lodash/set';

export default class LogsKibanaService {
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
    this.KibanaApiService = OvhApiDbaas.Logs()
      .Output()
      .Elasticsearch()
      .Kibana()
      .v6();
    this.KibanaAapiService = OvhApiDbaas.Logs()
      .Output()
      .Elasticsearch()
      .Kibana()
      .Aapi();
    this.OperationApiService = OvhApiDbaas.Logs()
      .Operation()
      .v6();
    this.newKibana = {
      description: '',
    };
  }

  getAccountDetails(serviceName) {
    return this.LogsHomeService.getAccountDetails(serviceName);
  }

  getOrderCatalog(ovhSubsidiary) {
    return this.LogsOrderService.getOrderCatalog(ovhSubsidiary);
  }

  getNewKibana() {
    return this.newKibana;
  }

  getKibanas(serviceName) {
    return this.KibanaApiService.query({ serviceName })
      .$promise.then((indices) => {
        const promises = indices.map((kibanaId) =>
          this.getKibanaDetails(serviceName, kibanaId),
        );
        return this.$q.all(promises);
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_get_error', err, {}),
      );
  }

  getOwnKibanas(serviceName) {
    return this.getKibanas(serviceName)
      .then((kibanas) => kibanas.filter((kibana) => kibana.info.isEditable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_get_error', err, {}),
      );
  }

  getKibanaDetails(serviceName, kibanaId) {
    return this.KibanaAapiService.get({
      serviceName,
      kibanaId,
    }).$promise.then((kibana) => this.transformAapiKibana(kibana));
  }

  transformAapiKibana(kibana) {
    set(
      kibana,
      'info.stateType',
      this.LogsConstants.kibanaStateType[kibana.info.deliveryStatus],
    );
    return kibana;
  }

  deleteModal(kibanaName) {
    return this.CucControllerHelper.modal.showDeleteModal({
      titleText: this.$translate.instant('logs_kibana_modal_delete_title'),
      textHtml: this.$translate.instant('logs_kibana_modal_delete_question', {
        kibanaName,
      }),
    });
  }

  createKibana(serviceName, object) {
    return this.KibanaApiService.create(
      { serviceName },
      {
        description: object.description,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_to_create_success',
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_create_error', err, {
          name: object.description,
        }),
      );
  }

  updateKibana(serviceName, kibana, kibanaInfo) {
    return this.KibanaApiService.update(
      { serviceName, kibanaId: kibana.kibanaId },
      {
        description: kibanaInfo.description,
      },
    )
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_edit_success',
          { name: kibana.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_edit_error', err, {
          name: kibana.name,
        }),
      );
  }

  deleteKibana(serviceName, kibana) {
    return this.KibanaApiService.delete({
      serviceName,
      kibanaId: kibana.kibanaId,
    })
      .$promise.then((operation) => {
        this.resetAllCache();
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_to_delete_success',
          { name: kibana.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_delete_error', err, {
          name: kibana.name,
        }),
      );
  }

  resetAllCache() {
    this.KibanaApiService.resetAllCache();
    this.KibanaAapiService.resetAllCache();
  }
}

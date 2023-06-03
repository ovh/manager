export default class LogsOsdService {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    CucCloudPoll,
    CucControllerHelper,
    LogsHelperService,
    iceberg,
    CucServiceHelper,
    CucUrlHelper,
    LogsConstants,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.CucCloudPoll = CucCloudPoll;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHelperService = LogsHelperService;
    this.iceberg = iceberg;
    this.CucServiceHelper = CucServiceHelper;
    this.CucUrlHelper = CucUrlHelper;
    this.LogsConstants = LogsConstants;

    this.newOsd = {
      description: '',
    };
  }

  getNewOsd() {
    return this.newOsd;
  }

  getOsds(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/osd`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getPaginatedOsds(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'name', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/output/opensearch/osd`)
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

  getOwnOsds(serviceName) {
    return this.getOsds(serviceName)
      .then(({ data = [] }) => data.filter((osd) => osd.isEditable))
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_get_error', err, {}),
      );
  }

  deleteModal(osdName) {
    return this.CucControllerHelper.modal.showDeleteModal({
      titleText: this.$translate.instant('logs_kibana_modal_delete_title'),
      textHtml: this.$translate.instant('logs_kibana_modal_delete_question', {
        osdName,
      }),
    });
  }

  createOsd(serviceName, object) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/output/opensearch/osd`, {
        description: object.description,
      })
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_to_create_success',
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_create_error', err, {
          name: object.description,
        }),
      );
  }

  updateOsd(serviceName, osd, osdInfo) {
    return this.$http
      .put(`/dbaas/logs/${serviceName}/output/opensearch/osd/${osd.osdId}`, {
        description: osdInfo.description,
      })
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_edit_success',
          { name: osd.name },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_edit_error', err, {
          name: osd.name,
        }),
      );
  }

  deleteOsd(serviceName, osd) {
    return this.$http
      .delete(`/dbaas/logs/${serviceName}/output/opensearch/osd/${osd.osdId}`)
      .then((operation) =>
        this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_kibana_to_delete_success',
          { name: osd.name },
        ),
      )
      .catch((err) =>
        this.LogsHelperService.handleError('logs_kibana_delete_error', err, {
          name: osd.name,
        }),
      );
  }

  getOpenSearchUrl(serviceName, osd) {
    return this.$http
      .get(`/dbaas/logs/${serviceName}/output/opensearch/osd/${osd.osdId}/url`)
      .then(({ data: urls }) =>
        this.CucUrlHelper.constructor.findUrl(
          { urls },
          this.LogsConstants.OSD_WEBUI,
        ),
      );
  }
}

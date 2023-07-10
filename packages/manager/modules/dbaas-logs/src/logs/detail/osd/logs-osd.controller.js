import template from './add/logs-osd-add.html';
import datagridToIcebergFilter from '../logs-iceberg.utils';

export default class LogsOsdCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsOsdService,
    $window,
  ) {
    this.$stateParams = $stateParams;
    this.ouiDatagridService = ouiDatagridService;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsOsdService = LogsOsdService;
    this.$window = $window;
  }

  loadOsds({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsOsdService.getPaginatedOsds(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          template,
          controller: 'LogsOsdAddModalCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
          resolve: {
            serviceName: () => this.serviceName,
            osdInfo: () => info,
          },
        },
      })
      .finally(() => {
        this.ouiDatagridService.refresh('osds-datagrid', true);
      });
  }

  showDeleteConfirm(info) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsOsdService.deleteModal(info.name).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsOsdService.deleteOsd(this.serviceName, info).finally(() => {
            this.ouiDatagridService.refresh('osds-datagrid', true);
            this.CucControllerHelper.scrollPageToTop();
          }),
      });

      this.delete.load();
    });
  }

  openOsd(osd) {
    this.LogsOsdService.getOpenSearchUrl(this.serviceName, osd).then((url) => {
      this.$window.open(url, '_blank');
    });
  }
}

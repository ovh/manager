import template from './add/logs-index-add.html';
import datagridToIcebergFilter from '../logs-iceberg.utils';

export default class LogsIndexCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $stateParams,
    $window,
    ouiDatagridService,
    CucCloudMessage,
    CucControllerHelper,
    LogsIndexService,
    LogsConstants,
  ) {
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.ouiDatagridService = ouiDatagridService;
    this.serviceName = this.$stateParams.serviceName;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsIndexService = LogsIndexService;
    this.LogsConstants = LogsConstants;
    this.suffixPattern = this.LogsConstants.suffixPattern;
    this.bytes = $filter('bytes');
  }

  loadIndices({ offset, pageSize = 1, sort, criteria }) {
    const filters = criteria.map((criterion) => {
      const name = criterion.property || 'name';
      return datagridToIcebergFilter(name, criterion.operator, criterion.value);
    });
    const pageOffset = Math.ceil(offset / pageSize);
    return this.LogsIndexService.getPaginatedIndices(
      this.serviceName,
      pageOffset,
      pageSize,
      { name: sort.property, dir: sort.dir === -1 ? 'DESC' : 'ASC' },
      filters,
    );
  }

  add(info) {
    this.CucCloudMessage.flushChildMessage();
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template,
        controller: 'LogsIndexAddModalCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => this.serviceName,
          indexInfo: () => info,
        },
      },
    });
  }

  storageColor(index) {
    const percentage = parseInt((index.currentSize * 100) / index.maxSize, 10);
    if (percentage >= 80) {
      return `oui-badge_${this.LogsConstants.indexStorage.error}`;
    }
    if (percentage < 60) {
      return `oui-badge_${this.LogsConstants.indexStorage.success}`;
    }
    if (percentage >= 60 && percentage < 80) {
      return `oui-badge_${this.LogsConstants.indexStorage.warning}`;
    }
    return null;
  }

  showDeleteConfirm(indice) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsIndexService.deleteModal(indice.name).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsIndexService.deleteIndex(this.serviceName, indice).finally(
            () => {
              this.ouiDatagridService.refresh('indices-datagrid', true);
              this.CucControllerHelper.scrollPageToTop();
            },
          ),
      });
      this.delete.load();
    });
  }

  openOpenSearch(index) {
    this.LogsIndexService.getOpenSearchUrl(this.serviceName, index).then(
      (url) => {
        this.$window.open(url, '_blank');
      },
    );
  }
}

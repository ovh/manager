import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class iplbListingCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $state,
    $q,
    $translate,
    ouiDatagridService,
    CucControllerHelper,
    constants,
  ) {
    super($q, ouiDatagridService);
    this.$state = $state;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
    this.CucControllerHelper = CucControllerHelper;
    this.constants = constants;
  }

  $onChanges() {
    this.columnsWithTranslatedHeaders = this.columns.map((column) => {
      const translatedHeader = this.$translate.instant(
        `iplb_listing_header_${column.property}`,
      );
      return {
        ...column,
        title: translatedHeader,
        label: translatedHeader,
      };
    });
  }

  gotoService({ serviceName }) {
    this.$state.go('iplb.detail.home', { serviceName });
  }

  deleteIplb(service) {
    this.$state.go('iplb.index.terminate', { id: service.serviceName });
  }
}

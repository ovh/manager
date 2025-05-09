import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

export default class iplbListingCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor($state, $q, ouiDatagridService, CucControllerHelper, constants) {
    super($q, ouiDatagridService);
    this.$state = $state;
    this.ouiDatagridService = ouiDatagridService;
    this.CucControllerHelper = CucControllerHelper;
    this.constants = constants;
  }

  gotoService({ serviceName }) {
    this.$state.go('iplb.detail.home', { serviceName });
  }

  deleteIplb(service) {
    this.$state.go('iplb.index.terminate', { id: service.serviceName });
  }
}

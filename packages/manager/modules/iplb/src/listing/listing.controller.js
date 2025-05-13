import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import template from '../modal/terminate/terminate.html';

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
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template,
        controller: 'IpLoadBalancerTerminateCtrl',
        controllerAs: '$ctrl',
        resolve: {
          service: () => service,
        },
      },
    });
  }
}

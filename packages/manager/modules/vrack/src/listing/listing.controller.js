import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
} from '../vrack.constant';

export default class vrackListingCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $state,
    atInternet,
    $q,
    ouiDatagridService,
    CucControllerHelper,
    constants,
    coreConfig,
  ) {
    super($q, ouiDatagridService);
    this.$state = $state;
    this.atInternet = atInternet;
    this.constants = constants;
    this.id = 'vrack-listing';
    this.user = coreConfig.getUser();
  }

  gotoVrackOrder() {
    this.atInternet.trackClick({
      name: `${VRACK_TRACKING_PREFIX}page::button::go-to-order::vrack-private-network`,
      ...VRACK_TRACKING_CONTEXT,
      type: 'action',
    });
    this.$state.go('vrack.order');
  }

  gotoService({ serviceName }) {
    this.$state.go('vrack.detail.home', { serviceName });
  }

  deleteVrack({ serviceName }) {
    this.atInternet.trackClick({
      name: `${VRACK_TRACKING_PREFIX}datagrid::button::delete::vrack-private-network`,
      ...VRACK_TRACKING_CONTEXT,
      type: 'action',
    });
    this.$state.go('vrack.index.terminateVrack', { service: serviceName });
  }
}

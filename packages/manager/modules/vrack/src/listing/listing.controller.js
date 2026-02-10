import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import {
  VRACK_TRACKING_PREFIX,
  VRACK_TRACKING_CONTEXT,
} from '../vrack.constant';

export default class vrackListingCtrl extends ListLayoutHelper.ListLayoutCtrl {
  /* @ngInject */
  constructor(
    $injector,
    $state,
    atInternet,
    $q,
    ouiDatagridService,
    constants,
    coreConfig,
  ) {
    super($q, ouiDatagridService);
    this.$injector = $injector;
    this.$state = $state;
    this.atInternet = atInternet;
    this.constants = constants;
    this.id = 'vrack-listing';
    this.user = coreConfig.getUser();
    this.publicIpUrls = {}; // Cache for public IP URLs
  }

  loadPage() {
    return this.$q.resolve({
      data: this.resources?.data,
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
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
    this.$state.go('vrack.index.terminateVrack', { serviceName });
  }

  getPublicIpUrl(serviceName) {
    // If already cached, return directly
    if (this.publicIpUrls[serviceName]) {
      return this.publicIpUrls[serviceName];
    }

    // Otherwise, load and cache
    this.$injector
      .get('shellClient')
      .navigation.getURL('network-vrack', `#/vrack/${serviceName}`)
      .then((url) => {
        this.publicIpUrls[serviceName] = url;
      });

    return '#'; // Temporary URL while loading
  }
}

import _ from 'lodash';
import constant from '../telecom-dashboard.constant';

export default class TelecomDashboardGuidesCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.guides = ['packActivate', 'modemConfig', 'modemReinit', 'interruptedService'];
    this.links = _.pick(constant.guides, this.guides);
  }

  trackRedirection(link) {
    const index = _.findIndex(this.guides, guide => constant.guides[guide] === link) + 1;
    return this.atInternet.trackClick({
      name: `TopGuide-Telecom-${index}`,
      type: 'navigation',
      level2: 'Telecom',
      chapter1: 'telecom',
    });
  }
}

import findIndex from 'lodash/findIndex';
import pick from 'lodash/pick';

import constant from '../telecom-dashboard.constant';

export default class TelecomDashboardGuidesCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.guides = [
      'packActivate',
      'modemConfig',
      'modemReinit',
      'interruptedService',
      'endOfCopper',
    ];
    this.links = pick(constant.guides, this.guides);
  }

  trackRedirection(link) {
    const index =
      findIndex(this.guides, (guide) => constant.guides[guide] === link) + 1;
    return this.atInternet.trackClick({
      name: `TopGuide-Telecom-${index}`,
      type: 'navigation',
      level2: '87',
      chapter1: 'telecom',
    });
  }
}

angular.module('managerApp').controller('TelecomDashboardGuidesCtrl', class TelecomDashboardGuidesCtrl {
  constructor(atInternet, URLS) {
    this.atInternet = atInternet;
    this.URLS = URLS;
  }

  $onInit() {
    this.guides = ['packActivate', 'modemConfig', 'modemReinit', 'interruptedService'];
    this.links = _.pick(this.URLS.guides, this.guides);
  }

  trackRedirection(link) {
    const index = _.findIndex(this.guides, guide => this.URLS.guides[guide] === link) + 1;
    return this.atInternet.trackClick({
      name: `TopGuide-Telecom-${index}`,
      type: 'navigation',
      level2: 'Telecom',
      chapter1: 'telecom',
    });
  }
});

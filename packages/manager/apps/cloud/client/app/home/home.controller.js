import filter from 'lodash/filter';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

class HomeCtrl {
  constructor(
    $q,
    DocsService,
    CucFeatureAvailabilityService,
    ovhUserPref,
    coreConfig,
  ) {
    this.$q = $q;
    this.DocsService = DocsService;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.ovhUserPref = ovhUserPref;
    this.region = coreConfig.getRegion();
  }

  $onInit() {
    this.defaultSections = ['PROJECT', 'VPS'];
    this.guides = {};
    this.guides.all = this.DocsService.getAllGuidesLink();
    this.newRegionsAvailableMessageKey = 'NOTIFY_APAC_REGIONS_AVAILABILITY';
    this.showNewRegionsAvailableMessage = false;
    this.initNewRegionsAvailableMessage(this.newRegionsAvailableMessageKey);
    return this.setSections();
  }

  setSections() {
    const sectionsPromise = map(this.defaultSections, (section) =>
      this.CucFeatureAvailabilityService.hasFeaturePromise(section, 'guides'),
    );

    return this.$q.all(sectionsPromise).then((sections) => {
      this.guides.sections = map(
        filter(this.defaultSections, (value, index) => sections[index]),
        (section) => this.DocsService.getGuidesOfSection(section),
      );

      return this.guides.sections;
    });
  }

  onNewRegionsAvailableMessageDismiss() {
    this.dismissNewRegionsAvailableKey(this.newRegionsAvailableMessageKey);
  }

  initNewRegionsAvailableMessage(key) {
    this.getNewRegionsAvailableKey(key).then((newRegionsAvailableValue) => {
      if (isEmpty(newRegionsAvailableValue)) {
        // user visiting first time, show the message
        this.showNewRegionsAvailableMessage = true;
      } else if (!newRegionsAvailableValue.dismissed) {
        // user has not dismissed the info message, show it
        this.showNewRegionsAvailableMessage = true;
      }
    });
  }

  getNewRegionsAvailableKey(key) {
    return this.ovhUserPref.getValue(key).catch((err) => {
      // check if key not found
      if (err.status === 404 && includes(err.data.message, key)) {
        // key is not found, add it
        this.addNewRegionsAvailableKey(key);
      }
      return null;
    });
  }

  addNewRegionsAvailableKey(key) {
    return this.ovhUserPref.create(key, { dismissed: false });
  }

  dismissNewRegionsAvailableKey(key) {
    return this.ovhUserPref.assign(key, { dismissed: true });
  }
}

angular.module('managerApp').controller('HomeCtrl', HomeCtrl);

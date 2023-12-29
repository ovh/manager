import controller from './view.controller';
import template from './view.html';

export default {
  controller,
  template,
  bindings: {
    isCurrentDnsZone: '<',
    creationDate: '<',
    url: '<',
    goBack: '<',
    getDnsZoneData: '<',
    goToDnsRestore: '<',
  },
};

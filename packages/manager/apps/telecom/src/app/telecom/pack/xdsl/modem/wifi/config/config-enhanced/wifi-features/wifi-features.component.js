import controller from './wifi-features.controller';
import template from './wifi-features.html';

export default {
  controller,
  template,
  controllerAs: 'WifiFeaturesCtrl',
  bindings: {
    isLoading: '<',
    mesh: '=',
    onessid: '=',
    canUpdateMesh: '<',
    canUpdateOneSsid: '<',
    onModemPropertyChange: '&',
  },
};

import controller from './controller';
import template from './index.html';

export default {
  name: 'vpsDashboardTileConfiguration',
  controller,
  template,
  bindings: {
    configurationTile: '<',
    catalog: '<',
    vps: '<',
    stateVps: '<',
    goToUpgrade: '<',
    vpsUpgradeTask: '<',
  },
};

import controller from './controller';
import template from './index.html';

export default {
  name: 'vpsDashboardTileConfigurationUpgrade',
  controller,
  template,
  bindings: {
    resolve: '<',
  },
};

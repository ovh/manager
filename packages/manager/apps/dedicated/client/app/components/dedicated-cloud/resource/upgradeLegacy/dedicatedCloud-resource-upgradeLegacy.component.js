import controller from './dedicatedCloud-resource-upgradeLegacy.controller';
import template from './dedicatedCloud-resource-upgradeLegacy.html';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    id: '<',
    productId: '<',
    type: '<',
    upgradeType: '<',
  },
  name: 'ovhManagerPccResourceUpgradeLegacy',
};

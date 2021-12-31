import controller from './snapshot.controller';
import template from './snapshot.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    storageId: '<',
    storage: '<',
    priceEstimation: '<',
    catalogEndpoint: '<',
    goBack: '<',
  },
};

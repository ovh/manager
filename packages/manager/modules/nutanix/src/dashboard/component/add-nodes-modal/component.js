import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    nodeTechnicalDetails: '<',
    cluster: '<',
    server: '<',
    nodePricing: '<',
    nodeOrderLinkGenerator: '<',
    expressOrderLink: '<',
    handleSuccess: '<',
  },
  template,
  controller,
};

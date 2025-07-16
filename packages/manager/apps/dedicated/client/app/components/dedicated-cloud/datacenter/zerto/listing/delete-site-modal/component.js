import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    deleteSite: '<',
    handleSuccess: '<',
    handleError: '<',
    zertoSite: '<',
  },
  template,
  controller,
};

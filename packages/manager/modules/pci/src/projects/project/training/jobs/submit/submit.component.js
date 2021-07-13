import controller from './submit.controller';
import template from './submit.html';
import './submit.scss';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    user: '<',
    presetImages: '<',
    getCatalogEntryF: '<',
    regions: '<',
    containers: '<',
    goToData: '<',
  },
};

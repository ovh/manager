import template from './versions-list.html';

export default {
  template,
  bindings: {
    versions: '<',
    selectedVersion: '=',
    displaySelectedVersion: '<',
  },
};

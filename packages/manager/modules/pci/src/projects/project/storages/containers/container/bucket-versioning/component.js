import template from './template.html';

const component = {
  bindings: {
    isBucketVersioningEnabled: '=',
    forceEnableVersioning: '<',
  },
  template,
};

export default component;

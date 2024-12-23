import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isBucketVersioningEnabled: '<',
    onBucketVersioningChange: '&',
    forceEnableVersioning: '<',
  },
  template,
  controller,
};

export default component;

import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isBucketVersioningEnabled: '<',
    onBucketVersioningChange: '&',
  },
  template,
  controller,
};

export default component;

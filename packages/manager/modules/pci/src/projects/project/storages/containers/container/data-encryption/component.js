import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    encryption: '=',
    encryptionAlgorithms: '<',
    trackEncryptionAction: '<',
  },
  template,
  controller,
};

export default component;

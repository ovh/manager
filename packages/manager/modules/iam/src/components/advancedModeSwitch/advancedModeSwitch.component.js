import { asBindings } from '../../resolves';
import template from './advancedModeSwitch.template.html';
import resolves from './advancedModeSwitch.resolves';
import controller from './advancedModeSwitch.controller';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  template,
  controller,
};

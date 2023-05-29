import { asBindings } from '../../resolves';

import controller from './createPolicy.controller';
import resolves from './createPolicy.resolves';
import template from './createPolicy.template.html';
import './createPolicy.styles.scss';

export default {
  bindings: {
    ...asBindings(resolves),
  },
  controller,
  template,
};

import {
  asBindings,
  alertResolve,
  goToResolve,
  cursorsParamResolve,
} from '@iam/resolves';

import controller from './policies.controller';
import template from './policies.template.html';

export const resolves = [alertResolve, goToResolve, cursorsParamResolve];

export default {
  bindings: asBindings(resolves),
  controller,
  template,
};

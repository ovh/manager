import {
  asBindings,
  alertResolve,
  goToResolve,
  onboardingGuidesResolve,
} from '@iam/resolves';

import controller from './createPolicy.controller';
import template from './createPolicy.template.html';

export const resolves = [alertResolve, goToResolve, onboardingGuidesResolve];

export default {
  bindings: asBindings(resolves),
  controller,
  template,
};

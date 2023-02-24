import { asBindings, onboardingGuidesResolve } from '@iam/resolves';
import template from './policy.template.html';

export const resolves = [onboardingGuidesResolve];

export default {
  bindings: asBindings(resolves),
  template,
};

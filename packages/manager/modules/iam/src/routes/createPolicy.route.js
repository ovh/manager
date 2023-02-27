import { createPolicy } from '@iam/components';
import { asParams, asResolve } from '@iam/resolves';

export const name = 'createPolicy';
export const params = [];

export const state = () => ({
  url: '/policy/create',
  component: createPolicy.name,
  params: asParams(params),
  resolve: {
    ...asResolve(createPolicy.resolves),
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('iam_create_policy_title'),
  },
});

export default {
  name,
  state,
};

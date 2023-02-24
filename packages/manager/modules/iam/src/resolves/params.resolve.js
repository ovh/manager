import { cursorsType } from './types';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The cursor parameter
 * @returns {string}
 */
export const cursorsParamResolve = /* @ngInject */ ($transition$) =>
  $transition$.params()[cursorsParamResolve.key];

cursorsParamResolve.key = 'c';
cursorsParamResolve.declaration = {
  array: false,
  dynamic: true,
  inherit: false,
  squash: true,
  type: cursorsType,
  value: () => ({ index: 1 }),
};

// ---------------------------------------------------------------------------------------------------- //

export default {
  cursorsParamResolve,
};

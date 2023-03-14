import { cursorsType, uuidType } from './types';

// ---------------------------------------------------------------------------------------------------- //

/**
 * The cursor parameter
 * @returns {string}
 */
const cursorsParamResolve = /* @ngInject */ ($transition$) =>
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

/**
 * The Policy parameter based on the policy's id
 * @returns {Object|null}
 */
const policyParamResolve = /* @ngInject */ ($transition$, PolicyService) => {
  const { [policyParamResolve.key]: uuid } = $transition$.params();
  return uuid ? PolicyService.getPolicy(uuid) : null;
};

policyParamResolve.key = 'policy';
policyParamResolve.declaration = {
  array: false,
  type: uuidType,
  value: null,
};

// ---------------------------------------------------------------------------------------------------- //

export { cursorsParamResolve, policyParamResolve };

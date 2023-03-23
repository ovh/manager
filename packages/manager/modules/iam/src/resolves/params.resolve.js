import { cursorsType, urnType, uuidType } from './types';

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

/**
 * The Identity parameter based on the identity's urn
 * @returns {Object|null}
 */
const identityParamResolve = /* @ngInject */ ($transition$) => {
  const { [identityParamResolve.key]: identity } = $transition$.params();
  return identity ?? null;
};

identityParamResolve.key = 'identity';
identityParamResolve.declaration = {
  array: false,
  type: urnType,
  value: null,
};

// ---------------------------------------------------------------------------------------------------- //

/**
 * The resourceGroup parameter based on the resourceGroup's id
 * @returns {Object|null}
 */
const resourceGroupParamResolve = /* @ngInject */ (
  $transition$,
  ResourceGroupService,
) => {
  const { [resourceGroupParamResolve.key]: uuid } = $transition$.params();
  return uuid ? ResourceGroupService.getResourceGroup(uuid) : null;
};

resourceGroupParamResolve.key = 'resourceGroup';
resourceGroupParamResolve.declaration = {
  array: false,
  type: uuidType,
  value: null,
};

// ---------------------------------------------------------------------------------------------------- //

export {
  cursorsParamResolve,
  identityParamResolve,
  policyParamResolve,
  resourceGroupParamResolve,
};

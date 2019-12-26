import component from './configure-access.component';

const resolveAllowedIPsAndBlocks = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) =>
  DedicatedCloud.getSecurityPolicies(
    $transition$.params().productId,
    null,
    null,
    true,
  ).then((allowedIPsAndBlocks) => allowedIPsAndBlocks.list.results);

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (ovhPaymentMethod) =>
  ovhPaymentMethod.hasDefaultPaymentMethod();

export default {
  component: component.name,
  params: {
    allowedIPsAndBlocks: null,
    hasDefaultMeansOfPayment: null,
  },
  resolve: {
    allowedIPsAndBlocks: resolveAllowedIPsAndBlocks,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
  },
};

import component from './place-order.component';

const resolveActivationType = /* @ngInject */ ($transition$) =>
  $transition$.params().activationType;

const resolveCurrentService = /* @ngInject */ ($transition$, DedicatedCloud) =>
  $transition$.params().currentService ||
  DedicatedCloud.getSelected($transition$.params().productId, true);

const resolveServicePackToOrder = /* @ngInject */ ($transition$) =>
  $transition$.params().servicePackToOrder;

export default {
  component: component.name,
  params: {
    activationType: null,
    currentService: null,
    hasDefaultMeansOfPayment: null,
    servicePackToOrder: null,
  },
  resolve: {
    activationType: resolveActivationType,
    currentService: resolveCurrentService,
    servicePackToOrder: resolveServicePackToOrder,
  },
};

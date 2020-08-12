import component from './place-order.component';

const resolveActivationType = /* @ngInject */ ($transition$) =>
  $transition$.params().activationType;

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
    servicePackToOrder: resolveServicePackToOrder,
  },
};

import component from './configure-users.component';

const resolveUsersWhoCanReceiveSMS = /* @ngInject */ (
  $q,
  $transition$,
  DedicatedCloud,
) =>
  $transition$.params().usersWhoCanReceiveSMS ||
  DedicatedCloud.getUsers($transition$.params().productId).then((ids) =>
    $q.all(
      ids.map((id) =>
        DedicatedCloud.getUserDetail($transition$.params().productId, id),
      ),
    ),
  );

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (
  $transition$,
  ovhPaymentMethod,
) =>
  $transition$.params().hasDefaultMeansOfPayment ||
  ovhPaymentMethod.hasDefaultPaymentMethod();

export default {
  component: component.name,
  params: {
    hasDefaultMeansOfPayment: null,
    usersWhoCanReceiveSMS: null,
  },
  resolve: {
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
    usersWhoCanReceiveSMS: resolveUsersWhoCanReceiveSMS,
  },
};

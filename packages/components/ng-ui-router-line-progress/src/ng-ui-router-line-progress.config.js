import NProgress from 'nprogress';

export default /* @ngInject */ ($transitions) => {
  $transitions.onBefore({}, (transition) => {
    if (
      !transition.ignored() &&
      transition.from().name !== '' &&
      transition.entering().length > 0
    ) {
      NProgress.start();
    }
  });

  $transitions.onSuccess({}, () => {
    NProgress.done();
  });

  $transitions.onError({}, () => {
    NProgress.done();
  });
};

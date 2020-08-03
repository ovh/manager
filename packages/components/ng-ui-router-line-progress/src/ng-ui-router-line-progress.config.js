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

  $transitions.onFinish({}, () => {
    NProgress.done();
  });
};

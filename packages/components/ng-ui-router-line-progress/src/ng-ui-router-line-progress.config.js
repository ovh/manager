import NProgress from 'nprogress';

export default /* @ngInject */ ($transitions) => {
  $transitions.onBefore({}, (transition) => {
    if (!transition.ignored() && transition.from().name !== '') {
      NProgress.start();
    }
  });

  $transitions.onFinish({}, () => {
    NProgress.done();
  });
};

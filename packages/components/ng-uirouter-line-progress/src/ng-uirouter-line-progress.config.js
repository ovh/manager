import NProgress from 'nprogress';

export default /* @ngInject */ ($transitions) => {
  $transitions.onBefore({}, (transition) => {
    if (!transition.ignored()) {
      NProgress.start();
    }
  });

  $transitions.onFinish({}, () => {
    NProgress.done();
  });
};

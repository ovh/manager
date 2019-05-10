import NProgress from 'nprogress';

export default /* @ngInject */ ($transitions) => {
  $transitions.onBefore({}, () => {
    NProgress.start();
  });

  $transitions.onFinish({}, () => {
    NProgress.done();
  });
};

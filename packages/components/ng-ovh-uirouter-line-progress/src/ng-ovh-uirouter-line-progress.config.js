import NProgress from 'nprogress';

export default /* @ngInject */ ($transitions) => {
  $transitions.onStart({}, () => {
    NProgress.start();
  });

  $transitions.onFinish({}, () => {
    NProgress.done();
  });
};

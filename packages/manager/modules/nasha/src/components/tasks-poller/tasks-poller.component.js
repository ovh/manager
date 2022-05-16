import controller from './tasks-poller.controller';

export default {
  bindings: {
    namespace: '@',
    nashaApiUrl: '@',
    operations: '=?',
    reload: '&',
    tasks: '=',
  },
  controller,
};

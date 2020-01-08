import set from 'lodash/set';

angular.module('managerApp').config((matchmediaProvider) => {
  // set rules the same as less vars
  set(matchmediaProvider, 'rules.phone', '(max-width: 992px)');
  set(
    matchmediaProvider,
    'rules.tablet',
    '(min-width: 993px) and (max-width: 1280px)',
  );
  set(matchmediaProvider, 'rules.desktop', '(min-width: 1280px)');
});

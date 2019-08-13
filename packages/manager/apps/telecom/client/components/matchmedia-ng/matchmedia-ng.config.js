angular.module('managerApp').config((matchmediaProvider) => {
  // set rules the same as less vars
  _.set(matchmediaProvider, 'rules.phone', '(max-width: 992px)');
  _.set(matchmediaProvider, 'rules.tablet', '(min-width: 993px) and (max-width: 1280px)');
  _.set(matchmediaProvider, 'rules.desktop', '(min-width: 1280px)');
});

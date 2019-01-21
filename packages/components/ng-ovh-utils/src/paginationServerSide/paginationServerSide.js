import angular from 'angular';

import paginationServerSideDirective from './paginationServerSide-directive';

const moduleName = 'ua.paginationServerSide';

angular
  .module(moduleName, [])
  .directive('paginationServerSide', paginationServerSideDirective)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;

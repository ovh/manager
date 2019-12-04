import angular from 'angular';

import validation from './validation';

const moduleName = 'wucOrderHelper';

angular
  .module(moduleName, [
    validation,
  ]);

export default moduleName;

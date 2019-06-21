import angular from 'angular';

import countryFlag from './country-flag';

const moduleName = 'signUpComponents';

angular
  .module(moduleName, [
    countryFlag,
  ]);

export default moduleName;

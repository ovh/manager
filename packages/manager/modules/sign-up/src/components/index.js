import angular from 'angular';

import countryFlag from './country-flag';
import siret from './siret';

const moduleName = 'ovhSignUpComponents';

angular.module(moduleName, [countryFlag, siret]);

export default moduleName;

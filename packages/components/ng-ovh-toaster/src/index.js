// dependencies.
import angular from 'angular';

// peerDependencies.
import 'angular-sanitize';

// styles.
import './messenger-theme-air.css';
import './messenger-theme-ice.css';

import provider from './provider';

// Define the angular module name as a string in order to export it safely.
const moduleName = 'ngOvhToaster';

angular.module(moduleName, ['ngSanitize']).provider('Toast', provider);

export default moduleName;

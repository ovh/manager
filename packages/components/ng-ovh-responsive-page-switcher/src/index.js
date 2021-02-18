import angular from 'angular';
import 'matchmedia-ng';
import 'angular-animate';

import directive from './directive';
import pageDirective from './page/directive';

import './index.less';

const moduleName = 'ngOvhResponsivePageSwitcher';

angular
  .module(moduleName, ['matchmedia-ng', 'ngAnimate'])
  .directive('responsiveSwitchPage', pageDirective)
  .directive('responsiveSwitch', directive);

export default moduleName;

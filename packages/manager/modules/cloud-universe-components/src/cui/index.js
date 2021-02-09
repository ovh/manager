import angular from 'angular';

import advancedOptions from './advanced-options';
import accordian from './accordion';
import message from './message';
import modal from './modal';
import page from './page';

import './grid.less';

const moduleName = 'ngOvhCloudUniverseComponentsCui';

angular.module(moduleName, [advancedOptions, accordian, message, modal, page]);
export default moduleName;

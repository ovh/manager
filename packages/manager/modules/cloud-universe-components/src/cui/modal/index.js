import angular from 'angular';

import component from './component';
import bodyComponent from './body/component';
import headerComponent from './header/component';
import textComponent from './text/component';
import footerComponent from './footer/component';

import './index.less';

const moduleName = 'cuiModal';

angular
  .module(moduleName, [])
  .component('cuiModal', component)
  .component('cuiModalBody', bodyComponent)
  .component('cuiModalHeader', headerComponent)
  .component('cuiModalText', textComponent)
  .component('cuiModalFooter', footerComponent);

export default moduleName;

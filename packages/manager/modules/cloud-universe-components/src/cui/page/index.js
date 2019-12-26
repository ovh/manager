import angular from 'angular';

import guideComponent from '../guide-component';

import contentComponent from './content/component';
import headerComponent from './header/component';
import headerTitleComponent from './header/title/component';

import './index.less';

const moduleName = 'cuiPage';

angular
  .module(moduleName, [guideComponent])
  .component('cuiPageContentTitle', contentComponent)
  .component('cuiPageHeader', headerComponent)
  .component('cuiPageHeaderTitle', headerTitleComponent);

export default moduleName;

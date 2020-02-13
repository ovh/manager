import angular from 'angular';

import component from './badge.component';
import './badge.scss';

const moduleName = 'ovhManagerPciComponentsProjectOfferBadge';

angular.module(moduleName, []).component('pciProjectOfferBadge', component);

export default moduleName;

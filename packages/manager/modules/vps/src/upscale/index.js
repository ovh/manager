import angular from 'angular';
import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import productOffers from '@ovh-ux/manager-product-offers';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import filters from '@ovh-ux/manager-filters';

import component from './upscale.component';
import routing from './upscale.routing';
import service from './upscale.service';

import vpsUpscaleConfigurationPrice from './configuration-price';
import vpsUpscaleModelPrice from './model-price';
import vpsUpscaleSummaryConfiguration from './summary-configuration';
import vpsUpscaleSummaryPrice from './summary-price';

const moduleName = 'ovhManagerVpsUpscale';

angular
  .module(moduleName, [
    filters,
    ngTranslateAsyncLoader,
    'oui',
    productOffers,
    'pascalprecht.translate',
    'ui.router',
    vpsUpscaleConfigurationPrice,
    vpsUpscaleModelPrice,
    vpsUpscaleSummaryConfiguration,
    vpsUpscaleSummaryPrice,
  ])
  .component(component.name, component)
  .config(routing)
  .service('upscaleService', service);

export default moduleName;

import picker from '../../../components/picker';
import noDefaultMeansOfPayment from '../../../../../no-default-means-of-payment';
import servicePackNoDefaultMeansOfPayment from '../../../components/no-default-means-of-payment';

import component from './selection.component';
import { factory, name as factoryName } from './selection.factory';

const moduleName = 'ovhManagerPccServicePackUpgradeSelection';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    picker,
    noDefaultMeansOfPayment,
    servicePackNoDefaultMeansOfPayment,
    'ui.router',
  ])
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .factory(factoryName, factory);

export default moduleName;

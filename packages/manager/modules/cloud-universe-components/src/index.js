import angular from 'angular';

import cucAutoComplete from './autocomplete';
import cucAdvancedOptions from './cui/advanced-options';
import cucAutofocus from './autofocus';
import cucBytes from './bytes';
import cucConfig from './config';
import cucConsumption from './consumption';
import cucCurrency from './currency';
import cucFeatureAvailability from './featureAvailability';
import cucFlavor from './flavor';
import cucHelper from './helper';
import cucMessage from './message';
import cucMomentFormat from './moment';
import cucNavigation from './navigation';
import cucPoll from './poll';
import cucPrice from './price';
import cucProducts from './products';
import cucRegion from './region';
import cucSpaceMeter from './space-meter';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular.module(moduleName, [
  cui,
  cucAutoComplete,
  cucAdvancedOptions,
  cucAutofocus,
  cucBytes,
  cucConfig,
  cucConsumption,
  cucCurrency,
  cucFeatureAvailability,
  cucFlavor,
  cucHelper,
  cucMessage,
  cucMomentFormat,
  cucNavigation,
  cucRegion,
  cucPoll,
  cucPrice,
  cucProducts,
  cucSpaceMeter,
  cucVrack,
  cui,
]);

export default moduleName;

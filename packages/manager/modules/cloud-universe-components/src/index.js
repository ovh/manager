import angular from 'angular';

import cucAdvancedOptions from './cui/advanced-options';
import cucAutofocus from './autofocus';
import cucConfig from './config';
import cucFeatureAvailability from './featureAvailability';
import cucHelper from './helper';
import cucGuidesHeader from './guides-header';
import cucMessage from './message';
import cucMomentFormat from './moment';
import cucNavigation from './navigation';
import cucPoll from './poll';
import cucPrice from './price';
import cucProducts from './products';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular.module(moduleName, [
  cui,
  cucAdvancedOptions,
  cucAutofocus,
  cucConfig,
  cucFeatureAvailability,
  cucGuidesHeader,
  cucHelper,
  cucMessage,
  cucMomentFormat,
  cucNavigation,
  cucPoll,
  cucPrice,
  cucProducts,
  cucVrack,
  cui,
]);

export default moduleName;

import angular from 'angular';

import cucAutoComplete from './autocomplete';
import cucAdvancedOptions from './cui/advanced-options';
import cucAutofocus from './autofocus';
import cucAutoSelect from './autoselect';
import cucBytes from './bytes';
import cucClickEnterOnKeypress from './clickEnterOnKeypress';
import cucConfig from './config';
import cucConsumption from './consumption';
import cucContracts from './contracts';
import cucCurrency from './currency';
import cucFeatureAvailability from './featureAvailability';
import cucFlavor from './flavor';
import cucHelper from './helper';
import cucHighlightedElement from './highlightedElement';
import cucMessage from './message';
import cucMomentFormat from './moment';
import cucMonitoring from './monitoring';
import cucNavigation from './navigation';
import cucOrderedHash from './orderedHash';
import cucPoll from './poll';
import cucPrice from './price';
import cucRegion from './region';
import cucProducts from './products';
import cucSmoothScrollHere from './smoothScrollHere';
import cucSpaceMeter from './space-meter';
import cucSshKeyMin from './sshKeyMin';
import cucUserPref from './user-pref';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular.module(moduleName, [
  cui,
  cucAutoComplete,
  cucAdvancedOptions,
  cucAutofocus,
  cucAutoSelect,
  cucBytes,
  cucClickEnterOnKeypress,
  cucConfig,
  cucConsumption,
  cucContracts,
  cucCurrency,
  cucFeatureAvailability,
  cucFlavor,
  cucHelper,
  cucHighlightedElement,
  cucMessage,
  cucMomentFormat,
  cucMonitoring,
  cucNavigation,
  cucOrderedHash,
  cucRegion,
  cucPoll,
  cucPrice,
  cucProducts,
  cucSmoothScrollHere,
  cucSpaceMeter,
  cucSshKeyMin,
  cucUserPref,
  cucVrack,
  cui,
]);

export default moduleName;

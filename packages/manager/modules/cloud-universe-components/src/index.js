import angular from 'angular';

import cucAutofocus from './autofocus';
import cucAutoSelect from './autoselect';
import cucClickEnterOnKeypress from './clickEnterOnKeypress';
import cucConfig from './config';
import cucConsumption from './consumption';
import cucFeatureAvailability from './featureAvailability';
import cucHelper from './helper';
import cucMessage from './message';
import cucMonitoring from './monitoring';
import cucNavigation from './navigation';
import cucOrderedHash from './orderedHash';
import cucPoll from './poll';
import cucRegion from './region';
import cucProducts from './products';
import cucSmoothScrollHere from './smoothScrollHere';
import cucSpaceMeter from './space-meter';
import cucUserPref from './user-pref';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucAutofocus,
    cucAutoSelect,
    cucClickEnterOnKeypress,
    cucConfig,
    cucConsumption,
    cucFeatureAvailability,
    cucHelper,
    cucMessage,
    cucMonitoring,
    cucNavigation,
    cucOrderedHash,
    cucRegion,
    cucPoll,
    cucProducts,
    cucSmoothScrollHere,
    cucSpaceMeter,
    cucUserPref,
    cucVrack,
    cui,
  ]);

export default moduleName;
